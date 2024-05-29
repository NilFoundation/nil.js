import type { Hex } from "@noble/curves/abstract/utils";

/**
 * The interface for the message object. This object is used to represent a message in the network.
 */
interface IMessage {
  index: number;
  shardId: number;
  from: string;
  to: string;
  value: bigint;
  data: Hex;
  seqno: number;
  signature?: string | null;
  maxPriorityFeePerGas: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  chainId: number;
}

export type { IMessage };
