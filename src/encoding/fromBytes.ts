import { type Hex, toHex } from "../index.js";

const decoder = new TextDecoder("utf8");

/**
 * Converts bytes to a string.
 * @param bytes - The bytes to convert.
 * @returns The string representation of the input.
 */
const bytesToString = (bytes: Uint8Array): string => {
  const str = decoder.decode(bytes);

  return str;
};

const bytesToHex = (bytes: Uint8Array): Hex => {
  return toHex(bytes);
};

export { bytesToString, bytesToHex };
