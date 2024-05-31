import type { Hex } from "@noble/curves/abstract/utils";
import { keccak_256 as keccak_256Noble } from "@noble/hashes/sha3";

/**
 * Returns the keccak-256 hash of the data. It is used in the Nil blockchain.
 * @param data - The data to hash.
 * @returns The keccak-256 hash.
 */
const keccak_256 = (data: Hex) => {
  return keccak_256Noble(data);
};

export { keccak_256 };
