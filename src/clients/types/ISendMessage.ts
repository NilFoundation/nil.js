import type { IMessage } from "../../index.js";

/**
 * Data structure for the send message request
 */
type ISendMessage = {
  to: string;
  value: bigint;
  from?: string;
  seqno?: number;
  gasPrice?: bigint;
  gasLimit?: bigint;
  data?: Uint8Array;
} & Omit<
  IMessage,
  | "to"
  | "value"
  | "from"
  | "seqno"
  | "gasPrice"
  | "gasLimit"
  | "data"
  | "internal"
>;

export type { ISendMessage };
