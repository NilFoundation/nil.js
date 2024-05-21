import type { Hex } from "@noble/curves/abstract/utils";

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

/*
 * Checks if the value is an address. If the value is an address, it returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 */
const isAddress = (value: Hex): boolean => {
  return typeof value === "string" && ADDRESS_REGEX.test(value);
};

export { isAddress };
