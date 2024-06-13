import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex } from "../encoding/toHex.js";
import { addHexPrefix } from "../utils/hex.js";
import type { IPrivateKey } from "./types/IPrivateKey.js";

/**
 * Generate a new private key.
 * @returns Hex - Private key
 * @example
 * const privateKey = generatePrivateKey();
 */
const generateRandomPrivateKey = (): IPrivateKey =>
  addHexPrefix(toHex(secp256k1.utils.randomPrivateKey())) as IPrivateKey;

export { generateRandomPrivateKey };
