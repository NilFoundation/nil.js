import type { Hex } from "@noble/curves/abstract/utils";

const HEX_REGEX = /^[0-9a-fA-F]+$/;

/**
 * Checks if the value is a hex string. If the value is a hex string, it returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 */
const isHexString = (value: Hex): boolean => {
  return typeof value === "string" && HEX_REGEX.test(value);
};

/**
 * Remove a hex prefix from a hex string.
 * @param hex hex-string
 * @returns format: base16-string
 */
const removeHexPrefix = (hex: string): string => {
  return hex.replace(/^0x/i, "");
};

/**
 * Add a hex prefix to a hex string.
 * @param hex base16-string
 * @returns format: hex-string
 */
const addHexPrefix = (hex: string): string => {
  return `0x${removeHexPrefix(hex)}`;
};

export { isHexString, removeHexPrefix, addHexPrefix };
