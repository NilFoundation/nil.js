import type { Hex } from "@noble/curves/abstract/utils";
import type { Abi } from "abitype";

/**
 * Deploy data is a data structure that contains information to deploy a contract.
 */
type IDeployData = {
  /**
   * Compiled contract bytecode.
   */
  bytecode: Hex;
  /**
   * The contract's constructor arguments.
   */
  args?: Uint8Array;
  /**
   * The contract's Application Binary Interface (ABI).
   */
  abi?: Abi | readonly unknown[];
};

export type { IDeployData };
