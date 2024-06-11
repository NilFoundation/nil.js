import type { Hex } from "@noble/curves/abstract/utils";

/**
 * Deploy data is a data structure that contains information to deploy a contract.
 */
type IDeployData = {
  /**
   * Compiled contract bytecode.
   */
  bytecode: Hex;
  /**
   * Shard id.
   */
  shardId: number;
  /**
   * Public key.
   */
  pubkey?: Hex;
  /**
   * Sequence number.
   */
  seqno?: number;
};

export type { IDeployData };
