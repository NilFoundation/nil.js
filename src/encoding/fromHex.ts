import {
  type Hex,
  hexToBytes as hexToBytesNoble,
} from "@noble/curves/abstract/utils";
import { addHexPrefix } from "../index.js";

/**
 * Convert a hex string to bytes.
 * @param hex - The hex string to convert to bytes.
 * @returns The bytes representation of the input.
 */
const hexToBytes = (hex: Hex): Uint8Array => {
  if (typeof hex !== "string") {
    return hexToBytes(hex.toString());
  }

  return hexToBytesNoble(hex);
};

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
 * Convert a hex string to a string.
 * @param hex - The hex string to convert to a string.
 * @returns The string representation of the input.
 */
const hexToString = (hex: Hex): string => {
  if (typeof hex !== "string") {
    return hexToString(hex.toString());
  }

  let str = "";

  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(Number.parseInt(hex.substring(i, 2), 16));
  }

  return str;
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

export { hexToBytes, hexToNumber, hexToString, hexToBigInt };
