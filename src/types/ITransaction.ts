/**
 * The transaction type.
 */
interface ITransaction {
  index: number;
  shardId: number;
  from: string;
  to: string;
  value: number;
  data: string;
  seqno: number;
  signature: string | null;
  maxPriorityFeePerGas: number;
  gasPrice: number;
  maxFeePerGas: number;
  chainId: number;
}

export type { ITransaction };
