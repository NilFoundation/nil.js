import { bytesToHex, numberToHexUnpadded } from "@noble/curves/abstract/utils";

/**
 * Convert a string to a hex string.
 * @param str - The input string to convert to hex
 * @returns The hex string representation of the input.
 */
const stringToHex = (str: string): string => {
  let hex = "";

  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }

  return hex;
};

/**
 * Convert a string, number, bigint, boolean, or ByteArrayType to a hex string.
 * @param str - The input string to convert to hex
 * @returns The hex string representation of the input.
 */
const toHex = <T extends string | number | bigint | boolean | Uint8Array>(
  value: T,
): `0x${string}` => {
  if (typeof value === "string") {
    return `0x${stringToHex(value)}`;
  }

  if (typeof value === "number") {
    return `0x${numberToHexUnpadded(value)}`;
  }

  if (typeof value === "bigint") {
    return `0x${numberToHexUnpadded(value)}`;
  }

  if (typeof value === "boolean") {
    return `0x${(value ? 1 : 0).toString(16)}`;
  }

  return `0x${bytesToHex(value)}`;
};

export { toHex };
