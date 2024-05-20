import { bytesToHex, numberToHexUnpadded } from "@noble/curves/abstract/utils";

/**
 * Convert a string, number, bigint, boolean, or ByteArrayType to a hex string.
 * @param str - The input string to convert to hex
 * @returns The hex string representation of the input.
 */
const toHex = <T extends string | number | bigint | boolean | Uint8Array>(
  value: T,
): string => {
  if (typeof value === "string") {
    return Buffer.from(value).toString("hex");
  }

  if (typeof value === "number") {
    return numberToHexUnpadded(value);
  }

  if (typeof value === "bigint") {
    return numberToHexUnpadded(value);
  }

  if (typeof value === "boolean") {
    return (value ? 1 : 0).toString(16);
  }

  return bytesToHex(value);
};

export { toHex };
