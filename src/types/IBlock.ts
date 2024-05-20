/**
 * The block type.
 */
type IBlock = {
  /**
   * The block id.
   */
  id: number;
  /**
   * The previous block hash.
   */
  prevBlock: string;
  /**
   * The smart contracts root hash.
   */
  smartContractsRoot: string;
  /**
   * The messages root hash.
   */
  messagesRoot: string;
  /**
   * The receipts root hash.
   */
  receiptsRoot: string;
  /**
   * The child blocks root hash.
   */
  childBlocksRootHash: string;
  /**
   * The master chain hash.
   */
  masterChainHash: string;
  /**
   * The logs bloom.
   */
  logsBloom: string;
};

export type { IBlock };
