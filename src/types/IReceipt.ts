import type { ILog } from "./ILog.js";

/**
 * Receipt interface.
 */
type IReceipt = {
  success: boolean;
  gasUsed: number;
  bloom: string;
  logs: ILog[];
  msgHash: string;
  contractAddress: string;
  blockHash: string;
  blockNumber: bigint;
  msgIndex: bigint;
};

export type { IReceipt };
