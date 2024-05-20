/**
 * The message type.
 */
type IMessage = {
  index: number;
  shardId: number;
  from: string;
  to: string;
  value: number;
  data: string;
  seqno: number;
  signature: string;
};

export type { IMessage };
