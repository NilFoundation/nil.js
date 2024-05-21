import type { Hex } from "@noble/curves/abstract/utils";
import { hexToBytes } from "./fromHex.js";

/**
 * Converts a number to bytes.
 * @param num - The number to convert to bytes.
 * @returns The bytes.
 */
const numberToBytes = (num: number): Uint8Array => {
  return Buffer.from(num.toString());
};

const toBytes = (value: number | boolean | Hex): Uint8Array => {
  if (typeof value === "number") {
    return numberToBytes(value);
  }

  if (typeof value === "boolean") {
    return numberToBytes(value ? 1 : 0);
  }

  return hexToBytes(value);
};

export { toBytes, numberToBytes };
