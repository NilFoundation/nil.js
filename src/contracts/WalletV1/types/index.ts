import type { Abi, Address } from "abitype";
import type { ISigner, PublicClient } from "../../../index.js";
import type { Hex } from "../../../types/index.js";

/**
 * Represents the wallet configuration.
 *
 * @export
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
 * @export
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
 * @export
 * @typedef {SendMessageParams}
 */
export type SendMessageParams = {
  to: Address | Uint8Array;
  refundTo?: Address | Uint8Array;
  data?: Uint8Array;
  value: bigint;
  gas: bigint;
  deploy?: boolean;
  seqno?: number;
};

/**
 * Represents the params for sending a message synchronously.
 *
 * @export
 * @typedef {SendSyncMessageParams}
 */
export type SendSyncMessageParams = {
  to: Address | Uint8Array;
  data?: Uint8Array;
  value: bigint;
  gas: bigint;
  seqno?: number;
};

/**
 * Represents the params for making a request to the wallet.
 *
 * @export
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
 * @export
 * @typedef {DeployParams}
 */
export type DeployParams = {
  bytecode: Uint8Array;
  abi?: Abi;
  args?: unknown[];
  salt: Uint8Array | bigint;
  shardId: number;
  gas: bigint;
  value?: bigint;
};
