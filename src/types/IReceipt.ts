import type { Hex } from "./Hex.js";
import type { ILog } from "./ILog.js";

/**
 * The receipt interface.
 */
type IReceipt = {
  success: boolean;
  gasUsed: string;
  bloom: string;
  logs: ILog[];
  messageHash: Hex;
  contractAddress: string;
  blockHash: string;
  blockNumber: number;
  msgIndex: number;
  outMessages: Hex[] | null;
  outputReceipts: (IReceipt | null)[] | null;
  shardId: number;
};

type ProcessedReceipt = Omit<IReceipt, "gasUsed" | "outputReceipts"> & {
  gasUsed: bigint;
  outputReceipts: (ProcessedReceipt | null)[] | null;
};

export type { IReceipt, ProcessedReceipt };
