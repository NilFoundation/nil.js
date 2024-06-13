import type { Hex } from "@noble/curves/abstract/utils";
import { addHexPrefix } from "../utils/hex.js";

/**
 * Convert a hex string to a number.
 * @param hex - The hex string to convert to a number.
 * @returns The number representation of the input.
 */
const hexToNumber = (hex: Hex): number => {
  if (typeof hex !== "string") {
    return hexToNumber(hex.toString());
  }

  return Number.parseInt(hex, 16);
};

/**
 * Convert a hex string to a bigint.
 * @param hex - The hex string to convert to a bigint.
 * @returns The bigint representation of the input.
 */
const hexToBigInt = (hex: Hex): bigint => {
  if (typeof hex !== "string") {
    return hexToBigInt(hex.toString());
  }

  return BigInt(addHexPrefix(hex));
};

export { hexToNumber, hexToBigInt };
