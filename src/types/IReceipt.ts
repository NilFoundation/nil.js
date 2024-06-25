import type { Hex } from "./Hex.js";
import type { ILog } from "./ILog.js";

/**
 * The receipt interface.
 */
type IReceipt = {
  success: boolean;
  gasUsed: number;
  bloom: string;
  logs: ILog[];
  messageHash: Hex;
  contractAddress: string;
  blockHash: string;
  blockNumber: bigint;
  msgIndex: bigint;
  outMessages: Hex[] | null;
  outputReceipts: IReceipt[] | null;
  shardId: number;
};

export type { IReceipt };
