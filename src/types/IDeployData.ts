import type { Abi } from "abitype";

/**
 * Deploy data is a data structure that contains information to deploy a contract.
 */
type IDeployData = {
  /**
   * Compiled contract bytecode.
   */
  bytecode: Uint8Array;
  /**
   * The contract's constructor arguments.
   */
  args?: Uint8Array;
  /**
   * The contract's Application Binary Interface (ABI).
   */
  abi?: Abi | string[];
};

export type { IDeployData };
