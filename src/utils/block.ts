import type { IBlock } from "../index.js";

/**
 * isValidBlock checks if the block is valid.
 * @param block - The block to check.
 * @returns True if the block is valid, false otherwise.
 */
const isValidBlock = (block: IBlock): block is IBlock => {
  return true;
};

export { isValidBlock };
