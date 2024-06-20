import type { Hex } from "../index.js";

const HEX_REGEX = /^[0-9a-fA-F]+$/;

/**
 * Checks if the value is a hex string. If the value is a hex string, it returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 */
const isHexString = (value: unknown): value is Hex => {
  return (
    typeof value === "string" &&
    value.startsWith("0x") &&
    HEX_REGEX.test(removeHexPrefix(value) as string)
  );
};

/**
 * Remove a hex prefix from a hex string.
 * @param hex hex-string
 * @returns format: base16-string
 */
const removeHexPrefix = (str: Hex | string): string => {
  return str.startsWith("0x") ? str.slice(2) : str;
};

/**
 * Add a hex prefix to a hex string.
 * @param hex base16-string
 * @returns format: hex-string
 */
const addHexPrefix = (str: Hex | string): Hex => {
  return `0x${removeHexPrefix(str)}`;
};

export { isHexString, removeHexPrefix, addHexPrefix };
