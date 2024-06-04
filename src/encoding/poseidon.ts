import { poseidon } from "@iden3/js-crypto";

/**
 * Poseidon hash function.
 * @param inputs - The inputs to hash.
 * @param params - The parameters to hash.
 * @returns The hash.
 */
const poseidonHash = (bytes: Uint8Array) => {
  return poseidon.hashBytes(bytes);
};

export { poseidonHash };
