import { type Hex, bytesToHex } from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import {
  type ISignature,
  addHexPrefix,
  removeHexPrefix,
  toBytes,
  toHex,
} from "../index.js";
import { keccak_256 } from "../utils/keccak256.js";
import type { IAddress } from "./types/IAddress.js";
import type { IPrivateKey } from "./types/IPrivateKey.js";

/**
 * Returns the public key from the private key using the secp256k1 curve.
 */
const getPublicKey = (privateKey: IPrivateKey): Hex => {
  const publicKey = secp256k1.getPublicKey(removeHexPrefix(privateKey), false);
  return addHexPrefix(bytesToHex(publicKey));
};

/**
 * Generate a new private key.
 * @returns Hex - Private key
 * @example
 * const privateKey = generatePrivateKey();
 */
const generatePrivateKey = (): Hex => toHex(secp256k1.utils.randomPrivateKey());

const recoverPublicKey = (
  messageHash: Hex | Uint8Array,
  signature: ISignature,
) => {
  //
};

/**
 * Returns the address from the public key.
 * @param publicKey - Public key in hex format
 * @returns Address in hex format
 */
const getAddressFromPublicKey = (publicKey: Hex): IAddress => {
  const bytes = keccak_256(toBytes(removeHexPrefix(publicKey)));
  return toHex(bytes) as IAddress;
};

export {
  getPublicKey,
  generatePrivateKey,
  recoverPublicKey,
  getAddressFromPublicKey,
};
