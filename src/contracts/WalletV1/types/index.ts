import type { Abi, Address } from "abitype";
import type { ISigner, PublicClient } from "../../../index.js";
import type { Hex } from "../../../types/index.js";

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

export type DeployParams = {
  bytecode: Uint8Array;
  abi?: Abi;
  args?: unknown[];
  salt: Uint8Array | bigint;
  shardId: number;
  gas: bigint;
  value?: bigint;
};
