import { type Hex, numberToBytesLE } from "@noble/curves/abstract/utils";
import { poseidonHash } from "../encoding/poseidon.js";
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
 * Returns the shard ID from the provided address.
 * @param address - The address.
 */
const getShardIdFromAddress = (address: Hex): number => {
  if (typeof address === "string") {
    return Number.parseInt(address.slice(2, 6), 16);
  }

  return (address[0] << 8) | address[1];
};

const calculateAddress = (
  shardId: number,
  code: Uint8Array,
  salt: Uint8Array,
): Uint8Array => {
  if (!Number.isInteger(shardId)) {
    throw new Error("Shard ID must be an integer");
  }
  if (salt.length !== 32) {
    throw new Error("Salt must be 32 bytes");
  }
  if (code.length === 0) {
    throw new Error("Code must not be empty");
  }
  if (shardId < 0 || shardId > 0xffff) {
    throw new Error("Invalid shard ID");
  }
  const bytes = new Uint8Array(code.length + 32);
  bytes.set(code);
  bytes.set(salt, code.length);
  const hash = poseidonHash(bytes);
  const shardPart = numberToBytesLE(shardId, 2);
  const hashPart = numberToBytesLE(hash, 18);
  return new Uint8Array([...shardPart, ...hashPart]);
};

export { isAddress, getShardIdFromAddress, calculateAddress };
