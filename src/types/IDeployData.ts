import type { Abi } from "abitype";

/**
 * IDeployData is a data structure that contains information to deploy a contract.
 */
type IDeployData = {
  bytecode: Uint8Array;
  args?: unknown[];
  abi?: Abi;
  salt: Uint8Array | bigint;
  shard: number;
};

export type { IDeployData };
