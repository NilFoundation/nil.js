import type { Abi, Address } from "abitype";
import type { ISigner, PublicClient } from "../../../index.js";
import type { Token } from "../../../types/Token.js";
import type { Hex } from "../../../types/index.js";

/**
 * Represents the wallet configuration.
 *
 
 * @typedef {WalletV1Config}
 */
export type WalletV1Config = {
  pubkey: Uint8Array | Hex;
  shardId: number;
  client: PublicClient;
  signer: ISigner;
  salt: Uint8Array | bigint;
  address: Hex | Uint8Array;
  calculatedAddress?: boolean;
};

/**
 * Represents the message call params.
 *
 
 * @typedef {CallParams}
 */
export type CallParams = {
  to: Address;
  data: Uint8Array;
  value: bigint;
};

/**
 * Represents the params for sending a message.
 *
 * @typedef {SendMessageParams}
 */
export type SendMessageParams = {
  to: Address | Uint8Array;
  refundTo?: Address | Uint8Array;
  bounceTo?: Address | Uint8Array;
  data?: Uint8Array | Hex;
  value?: bigint;
  gas: bigint;
  tokens?: Token[];
  deploy?: boolean;
  seqno?: number;
};

/**
 * Represents the params for sending a message synchronously.
 *
 * @typedef {SendSyncMessageParams}
 */
export type SendSyncMessageParams = {
  to: Address | Uint8Array;
  data?: Uint8Array | Hex;
  value: bigint;
  gas: bigint;
  seqno?: number;
};

/**
 * Represents the params for making a request to the wallet.
 *
 * @typedef {RequestParams}
 */
export type RequestParams = {
  data: Uint8Array;
  deploy: boolean;
  seqno?: number;
};

/**
 * Represents the params for deploying a smart contract.
 *
 * @typedef {DeployParams}
 */
export type DeployParams = {
  bytecode: Uint8Array | Hex;
  abi?: Abi;
  args?: unknown[];
  salt: Uint8Array | bigint;
  shardId: number;
  gas: bigint;
  value?: bigint;
};
