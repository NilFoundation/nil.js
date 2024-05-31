import type { Hex } from "@noble/curves/abstract/utils";

/**
 * The block type.
 */
type IBlock = {
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

export type { IBlock };
