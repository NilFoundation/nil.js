import type { Hex } from "@noble/curves/abstract/utils";
import { BaseError, type IBaseErrorParameters } from "./BaseError.js";

/**
 * Interface for the parameters of the {@link BlockNotFoundError} constructor.
 */
type IBlockNotFoundErrorParameters = {
  blockNumberOrHash: number | Hex;
} & IBaseErrorParameters;

/**
 * Error class for block not found errors.
 * This error is thrown when a block is not found.
 */
class BlockNotFoundError extends BaseError {
  constructor({ blockNumberOrHash, ...rest }: IBlockNotFoundErrorParameters) {
    super(`Block not found: ${blockNumberOrHash}`, { ...rest });
  }
}

export { BlockNotFoundError };
