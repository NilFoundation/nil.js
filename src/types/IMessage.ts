/**
 * The interface for the message object. This object is used to represent a message in the network.
 */
interface IMessage {
  from: string;
  to: string;
  value: bigint;
  data: Uint8Array;
  seqno: number;
  gasPrice: bigint;
  gasLimit: bigint;
  internal: boolean;
}

export type { IMessage };
