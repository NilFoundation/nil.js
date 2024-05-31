import type { Hex } from "@noble/curves/abstract/utils";

/**
 * The interface for the message object. This object is used to represent a message in the network.
 */
interface IMessage {
  from: string;
  to: string;
  value: bigint;
  data: Hex;
  seqno: number;
  gasPrice: bigint;
  gasLimit: bigint;
}

export type { IMessage };
