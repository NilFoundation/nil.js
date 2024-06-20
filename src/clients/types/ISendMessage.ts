/**
 * The data structure for the send message request.
 */
type ISendMessage = {
  to: string;
  value: bigint;
  from?: string;
  seqno?: number;
  gasPrice?: bigint;
  gasLimit?: bigint;
  data?: Uint8Array;
};

export type { ISendMessage };
