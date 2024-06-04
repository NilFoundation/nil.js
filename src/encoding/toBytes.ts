import { type Hex, numberToBytesBE } from "@noble/curves/abstract/utils";
import { hexToBytes } from "./fromHex.js";

/**
 * Converts a number to bytes.
 * @param num - The number to convert to bytes.
 * @returns The bytes.
 */
const numberToBytes = (num: number | bigint, length = 2): Uint8Array => {
  return numberToBytesBE(num, length);
};

const toBytes = (value: number | boolean | Hex): Uint8Array => {
  if (typeof value === "number" || typeof value === "bigint") {
    return numberToBytes(value);
  }

  if (typeof value === "boolean") {
    return numberToBytes(value ? 1 : 0);
  }

  return hexToBytes(value);
};

export { toBytes, numberToBytes };
