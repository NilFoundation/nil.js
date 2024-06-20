import type { Hex } from "../index.js";
import { BaseError, type IBaseErrorParameters } from "./BaseError.js";

/**
 * Interface for the parameters of the {@link BlockNotFoundError} constructor.
 */
type BlockNotFoundErrorParameters = {
  blockNumberOrHash: number | Hex;
} & IBaseErrorParameters;

/**
 * Error class for block not found errors.
 * This error is thrown when a block is not found.
 */
class BlockNotFoundError extends BaseError {
  constructor({ blockNumberOrHash, ...rest }: BlockNotFoundErrorParameters) {
    super(`Block not found: ${blockNumberOrHash}`, { ...rest });
  }
}

export { BlockNotFoundError };
