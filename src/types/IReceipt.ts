import type { ILog } from "./ILog.js";

/**
 * The receipt interface.
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
  outMessages: string[];
};

export type { IReceipt };
