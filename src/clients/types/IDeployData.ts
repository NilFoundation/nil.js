import type { Hex } from "@noble/curves/abstract/utils";

/**
 * Deploy data is a data structure that contains information to deploy a contract.
 */
type IDeployData = {
  /**
   * Compiled contract bytecode.
   */
  bytecode: Hex;
  shardId: number;
  pubkey?: Hex;
  seqno?: number;
};

export type { IDeployData };
