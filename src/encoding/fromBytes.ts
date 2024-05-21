import { bytesToHex as bytesToHexNoble } from "@noble/curves/abstract/utils";

/**
 * Converts bytes to a hex string.
 * @param bytes - The bytes to convert to a hex string.
 * @returns The hex string representation of the input.
 */
const bytesToHex = (bytes: Uint8Array): string => {
  return bytesToHexNoble(bytes);
};

/**
 * Converts bytes to a string.
 * @param bytes - The bytes to convert to a string.
 * @returns The string representation of the input.
 */
const bytesToString = (bytes: Uint8Array): string => {
  return Buffer.from(bytes).toString("utf-8");
};

/**
 * Converts bytes to a number.
 * @param bytes - The bytes to convert to a number.
 * @returns The number representation of the input.
 */
const bytesToNumber = (bytes: Uint8Array): number => {
  return Number.parseInt(bytes.toString());
};

export { bytesToHex, bytesToString, bytesToNumber };
