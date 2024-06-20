import type { Abi } from "abitype";
import invariant from "tiny-invariant";
import { bytesToHex, encodeFunctionData, hexToBytes } from "viem";
import type { PublicClient } from "../../clients/PublicClient.js";
import { prepareDeployPart } from "../../encoding/deployPart.js";
import { externalMessageEncode } from "../../encoding/externalMessage.js";
import type { ISigner } from "../../signers/index.js";
import { refineAddress } from "../../utils/address.js";
import { refineCompressedPublicKey, refineSalt } from "../../utils/refiners.js";
import { code } from "./Wallet-bin.js";
import WalletAbi from "./Wallet.abi.json";
import type {
  DeployParams,
  RequestParams,
  SendMessageParams,
  SendSyncMessageParams,
  WalletV1Config,
} from "./types/index.js";

export class WalletV1 {
  static code = hexToBytes(code);
  static abi = WalletAbi as Abi;

  static calculateWalletAddress({
    pubKey,
    shardId,
    salt,
  }: {
    pubKey: Uint8Array;
    shardId: number;
    salt: Uint8Array | bigint;
  }) {
    const { address } = prepareDeployPart({
      abi: WalletAbi as Abi,
      bytecode: WalletV1.code,
      args: [bytesToHex(pubKey)],
      salt: salt,
      shard: shardId,
    });
    return address;
  }

  pubkey: Uint8Array;
  shardId: number;
  client: PublicClient;
  salt: Uint8Array;
  signer: ISigner;
  address: Uint8Array;

  constructor({
    pubkey,
    shardId,
    address,
    client,
    salt,
    signer,
    calculatedAddress,
  }: WalletV1Config) {
    this.pubkey = refineCompressedPublicKey(pubkey);
    this.shardId = shardId;
    this.client = client;
    this.salt = refineSalt(salt);
    this.signer = signer;
    this.address = refineAddress(address);
  }

  getAddressHex() {
    return bytesToHex(this.address);
  }

  async selfDeploy(waitTillConfirmation = true) {
    const [balance, code] = await Promise.all([
      await this.client.getBalance(this.getAddressHex(), "latest"),
      await this.client
        .getCode(this.getAddressHex(), "latest")
        .catch(() => Uint8Array.from([])),
    ]);

    invariant(code.length === 0, "Contract already deployed");
    invariant(balance > 0n, "Insufficient balance");

    const { data } = prepareDeployPart({
      abi: WalletAbi as Abi,
      bytecode: WalletV1.code,
      args: [bytesToHex(this.pubkey)],
      salt: this.salt,
      shard: this.shardId,
    });

    const { hash } = await this.requestToWallet({
      data: data,
      deploy: true,
      seqno: 0,
    });

    if (waitTillConfirmation) {
      while (true) {
        const code = await this.client.getCode(this.getAddressHex(), "latest");
        if (code.length > 0) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return hash;
  }

  async checkDeploymentStatus(): Promise<boolean> {
    const code = await this.client.getCode(this.getAddressHex(), "latest");
    return code.length > 0;
  }

  async requestToWallet(
    requestParams: RequestParams,
    send = true,
  ): Promise<{ raw: Uint8Array; hash: Uint8Array }> {
    const [seqno, chainId] = await Promise.all([
      requestParams.seqno ??
        this.client.getMessageCount(this.getAddressHex(), "latest"),
      this.client.chainId(),
    ]);
    const encodedMessage = await externalMessageEncode(
      {
        isDeploy: requestParams.deploy,
        to: this.address,
        chainId: chainId,
        seqno,
        data: requestParams.data,
      },
      this.signer,
    );
    if (send) await this.client.sendRawMessage(encodedMessage.raw);
    return encodedMessage;
  }

  async sendMessage({
    to,
    refundTo,
    data,
    deploy,
    seqno,
    gas,
    value,
  }: SendMessageParams) {
    const hexTo = bytesToHex(refineAddress(to));
    const hexRefundTo = bytesToHex(refineAddress(refundTo ?? this.address));

    const callData = encodeFunctionData({
      abi: WalletAbi,
      functionName: "asyncCall",
      args: [
        hexTo,
        hexRefundTo,
        gas,
        !!deploy,
        value,
        data ? bytesToHex(data) : "0x",
      ],
    });

    const { hash } = await this.requestToWallet({
      data: hexToBytes(callData),
      deploy: false,
      seqno,
    });

    return bytesToHex(hash);
  }

  async sendRawInternalMessage(rawMessage: Uint8Array) {
    const { hash } = await this.requestToWallet({
      data: rawMessage,
      deploy: false,
    });

    return bytesToHex(hash);
  }

  async deployContract({
    shardId,
    bytecode,
    abi,
    args,
    salt,
    value,
    gas,
  }: DeployParams) {
    const { data, address } = prepareDeployPart({
      shard: shardId,
      bytecode: bytecode,
      abi,
      args,
      salt,
    });

    const hash = await this.sendMessage({
      to: address,
      refundTo: this.getAddressHex(),
      data,
      value: value ?? 0n,
      deploy: true,
      gas,
    });

    return {
      hash,
      address: bytesToHex(address),
    };
  }

  async syncSendMessage({
    to,
    data,
    seqno,
    gas,
    value,
  }: SendSyncMessageParams) {
    const hexTo = bytesToHex(refineAddress(to));

    const callData = encodeFunctionData({
      abi: WalletAbi,
      functionName: "syncCall",
      args: [hexTo, gas, value, data ? bytesToHex(data) : "0x"],
    });

    const { hash } = await this.requestToWallet({
      data: hexToBytes(callData),
      deploy: false,
      seqno,
    });

    return bytesToHex(hash);
  }

  async getBalance() {
    return this.client.getBalance(this.getAddressHex(), "latest");
  }
}
