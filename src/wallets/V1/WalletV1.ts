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
  refundTo?: Address | Uint8Array;
  data?: Uint8Array;
  value: bigint;
  gas: bigint;
  deploy?: boolean;
  seqno?: number;
};

export type SendSyncMessageParams = {
  to: Address | Uint8Array;
  data?: Uint8Array;
  value: bigint;
  gas: bigint;
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
      this.salt = hexToBytes(`0x${salt.toString(16).padStart(64, "0")}`).slice(
        0,
        32,
      );
    } else {
      if (salt.length !== 32) {
        throw new Error("Salt must be 32 bytes");
      }
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
    refundTo,
    data,
    deploy,
    seqno,
    gas,
    value,
  }: SendMessageParams) {
    let hexTo: `0x${string}`;
    if (typeof to === "string" && !isAddress(to)) {
      throw new Error("Invalid address");
    }
    if (typeof to === "string") {
      hexTo = to;
    } else {
      hexTo = bytesToHex(to);
    }
    let hexRefundTo: `0x${string}`;
    if (refundTo) {
      if (typeof refundTo === "string" && !isAddress(refundTo)) {
        throw new Error("Invalid refund address");
      }
      if (typeof refundTo === "string") {
        hexRefundTo = refundTo;
      } else {
        hexRefundTo = bytesToHex(refundTo);
      }
    } else {
      hexRefundTo = this.getAddressHex();
    }

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
  async deployContract(
    bytecode: Uint8Array,
    salt: Uint8Array | bigint,
    shardId: number,
    gas: bigint,
  ) {
    let byteSalt: Uint8Array;
    if (typeof salt === "bigint") {
      byteSalt = hexToBytes(`0x${salt.toString(16).padStart(64, "0")}`).slice(
        0,
        32,
      );
    } else {
      if (salt.length !== 32) {
        throw new Error("Salt must be 32 bytes");
      }
      byteSalt = salt;
    }
    const bytecodeWithSalt = new Uint8Array([...bytecode, ...byteSalt]);
    return this.sendMessage({
      to: calculateAddress(shardId, bytecode, byteSalt),
      refundTo: this.getAddressHex(),
      data: bytecodeWithSalt,
      value: 0n,
      deploy: true,
      gas,
    });
  }
  async syncSendMessage({
    to,
    data,
    seqno,
    gas,
    value,
  }: SendSyncMessageParams) {
    let hexTo: `0x${string}`;
    if (typeof to === "string" && !isAddress(to)) {
      throw new Error("Invalid address");
    }
    if (typeof to === "string") {
      hexTo = to;
    } else {
      hexTo = bytesToHex(to);
    }

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
