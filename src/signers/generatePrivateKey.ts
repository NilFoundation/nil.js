import type { Hex } from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex } from "../index.js";

/**
 * Generate a new private key.
 * @returns Hex - Private key
 * @example
 * const privateKey = generatePrivateKey();
 */
const generatePrivateKey = (): Hex => toHex(secp256k1.utils.randomPrivateKey());

export { generatePrivateKey };
