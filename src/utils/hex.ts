import type { Hex } from "../index.js";

const HEX_REGEX = /^[0-9a-fA-F]+$/;

/**
 * Checks if the value is a hex string. If the value is a hex string, returns true.
 * Otherwise, returns false.
 * @param value The value to check.
 */
const isHexString = (value: unknown): value is Hex => {
  return (
    typeof value === "string" &&
    value.startsWith("0x") &&
    HEX_REGEX.test(removeHexPrefix(value) as string)
  );
};

/**
 * Remove the hex prefix from the hex string.
 * @param hex The string whose hex prefix should be removed.
 * @returns The base-16 string.
 */
const removeHexPrefix = (str: Hex | string): string => {
  return str.startsWith("0x") ? str.slice(2) : str;
};

/**
 * Add the hex prefix to the hex string.
 * @param hex The string to which the prefix should be added.
 * @returns The string with the prefix.
 */
const addHexPrefix = (str: Hex | string): Hex => {
  return `0x${removeHexPrefix(str)}`;
};

export { isHexString, removeHexPrefix, addHexPrefix };
