import type { Hex } from "./Hex.js";

/**
 * The block type.
 */
type Block = {
  id: string;
  prevBlock: Hex;
  smartContractsRoot: Hex;
  inMessagesRoot: Hex;
  outMessagesRoot: Hex;
  outMessagesNum: number;
  receiptsRoot: Hex;
  childBlocksRootHash: string;
  masterChainHash: Hex;
  // biome-ignore lint/suspicious/noExplicitAny: need to investigate
  logsBloom: any;
  timestamp: number;
};

/**
 * The block tag type.
 */
type BlockTag = "latest" | "earliest" | "pending";

export type { Block, BlockTag };
