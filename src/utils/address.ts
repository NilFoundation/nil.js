import type { Hex } from "@noble/curves/abstract/utils";
import type { IAddress } from "../signers/types/IAddress.js";

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

/*
 * Checks if the value is an address. If the value is an address, it returns true.
 * Otherwise, it returns false.
 * @param value - The value to check.
 */
const isAddress = (value: Hex): value is IAddress => {
  return typeof value === "string" && ADDRESS_REGEX.test(value);
};

/**
 * Returns the shard ID from the address.
 * @param address - The address.
 */
const getShardIdFromAddress = (address: Hex): number => {
  if (typeof address === "string") {
    return Number.parseInt(address.slice(2, 6), 16);
  }

  return (address[0] << 8) | address[1];
};

export { isAddress, getShardIdFromAddress };
