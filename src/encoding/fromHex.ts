import { hexToBytes } from "@noble/curves/abstract/utils";

/**
 * Convert a hex string to bytes.
 * @param hex - The hex string to convert to bytes.
 * @returns The bytes representation of the input.
 */
const fromHexToBytes = (hex: string): Uint8Array => {
  return hexToBytes(hex);
};

export { fromHexToBytes };
