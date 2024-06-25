import { poseidon } from "@iden3/js-crypto";

/**
 * Creates the Poseidon hash of the given bytes.
 * @param byes - The bytes to hash.
 * @returns The Poseidon hash.
 */
const poseidonHash = (bytes: Uint8Array) => {
  return poseidon.hashBytesX(bytes, 16);
};

export { poseidonHash };
