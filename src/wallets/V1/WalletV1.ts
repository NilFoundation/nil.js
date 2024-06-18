import type { Address } from "abitype";
import {
  type Hex,
  bytesToHex,
  encodeDeployData,
  encodeFunctionData,
  hexToBytes,
} from "viem";
import type { PublicClient } from "../../clients/PublicClient.js";
import type { ISigner } from "../../signers/index.js";
import { calculateAddress, isAddress } from "../../utils/address.js";
import { externalMessageEncode } from "../../utils/messageEncoding.js";
import { code } from "./Wallet-bin.js";
import WalletAbi from "./Wallet.abi.json";

export type WalletV1Config = {
  pubkey: Uint8Array | Hex;
  shardId: number;
  client: PublicClient;
  signer: ISigner;
  salt: Uint8Array | bigint;
  address: Hex | Uint8Array;
  calculatedAddress?: boolean;
};

export type CallParams = {
  to: Address;
  data: Uint8Array;
  value: bigint;
};

export type SendMessageParams = {
  to: Address | Uint8Array;
  data: Uint8Array;
  value: bigint;
  gas: bigint;
  deploy?: boolean;
  seqno?: number;
};

export type RequestParams = {
  data: Uint8Array;
  deploy: boolean;
  seqno?: number;
};

export class WalletV1 {
  static code = hexToBytes(code);
  static calculateWalletAddress({
    pubKey,
    shardId,
    salt,
  }: {
    pubKey: Uint8Array;
    shardId: number;
    salt: Uint8Array | bigint;
  }) {
    const constructorData = hexToBytes(
      encodeDeployData({
        abi: WalletAbi,
        bytecode: bytesToHex(WalletV1.code),
        args: [bytesToHex(pubKey)],
      }),
    );
    let byteSalt: Uint8Array;
    if (typeof salt === "bigint") {
      byteSalt = hexToBytes(`0x${salt.toString(16).padStart(64, "0")}`).slice(
        0,
        32,
      );
    } else {
      byteSalt = salt;
    }
    return calculateAddress(shardId, constructorData, byteSalt);
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
  }: WalletV1Config) {
    this.pubkey = typeof pubkey === "string" ? hexToBytes(pubkey) : pubkey;
    this.shardId = shardId;
    this.client = client;
    if (typeof salt === "bigint") {
      this.salt = hexToBytes(`0x${salt.toString(16).padStart(64, "0")}`);
    } else {
      this.salt = salt;
    }
    this.signer = signer;
    this.address =
      typeof address === "string" && isAddress(address)
        ? hexToBytes(address)
        : address;
    if (this.address.length !== 20) {
      throw new Error("Invalid address length");
    }
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
    if (code.length > 0) {
      throw new Error("Contract already deployed");
    }
    if (balance <= 0n) throw new Error("Insufficient balance");
    const constructorData = hexToBytes(
      encodeDeployData({
        abi: WalletAbi,
        bytecode: bytesToHex(WalletV1.code),
        args: [bytesToHex(this.pubkey)],
      }),
    );
    const bytecode = new Uint8Array([...constructorData, ...this.salt]);
    const { hash } = await this.requestToWallet({
      data: bytecode,
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
    data,
    deploy,
    seqno,
    gas,
    value,
  }: SendMessageParams) {
    if (typeof to === "string" && !isAddress(to)) {
      throw new Error("Invalid address");
    }
    const callData = encodeFunctionData({
      abi: WalletAbi,
      functionName: "sendMessage",
      args: [to, gas, deploy, value, data],
    });
    const { hash } = await this.requestToWallet({
      data: hexToBytes(callData),
      deploy: false,
      seqno,
    });
    return hash;
  }
  async sendRawInternalMessage(rawMessage: Uint8Array) {
    const { hash } = await this.requestToWallet({
      data: rawMessage,
      deploy: false,
    });
    return hash;
  }
  async deployContract(
    bytecode: Uint8Array,
    salt: Uint8Array,
    shardId: number,
    gas: bigint,
  ) {
    const bytecodeWithSalt = new Uint8Array([...bytecode, ...salt]);
    await this.sendMessage({
      to: calculateAddress(shardId, bytecode, salt),
      data: bytecodeWithSalt,
      value: 0n,
      deploy: true,
      gas,
    });
  }
  async getBalance() {
    return this.client.getBalance(this.getAddressHex(), "latest");
  }
}
