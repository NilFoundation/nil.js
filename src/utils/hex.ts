import type { Hex } from "@noble/curves/abstract/utils";

const HEX_REGEX = /^[0-9a-fA-F]+$/;

/**
 * Checks if the value is a hex string. If the value is a hex string, it returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 */
const isHexString = (value: Hex): value is Hex => {
  return (
    typeof value === "string" &&
    value.startsWith("0x") &&
    HEX_REGEX.test(removeHexPrefix(value))
  );
};

/**
 * Remove a hex prefix from a hex string.
 * @param hex hex-string
 * @returns format: base16-string
 */
const removeHexPrefix = (hex: Hex): string => {
  if (typeof hex !== "string") {
    throw new Error(`Expected a hex string but got ${hex}`);
  }

  return hex.startsWith("0x") ? hex.slice(2) : hex;
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
