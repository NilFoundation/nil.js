import type { Hex } from "../index.js";
import { addHexPrefix, removeHexPrefix } from "../utils/hex.js";

/**
 * Convert a hex string to a number.
 * @param hex - The hex string to convert to a number.
 * @returns The number representation of the input.
 */
const hexToNumber = (hex: Hex): number => {
  return Number.parseInt(removeHexPrefix(hex), 16);
};

/**
 * Convert a hex string to a bigint.
 * @param hex - The hex string to convert to a bigint.
 * @returns The bigint representation of the input.
 */
const hexToBigInt = (hex: Hex): bigint => {
  return BigInt(addHexPrefix(hex));
};

export { hexToNumber, hexToBigInt };
