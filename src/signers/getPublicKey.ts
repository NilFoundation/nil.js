import { type Hex, bytesToHex } from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { addHexPrefix, removeHexPrefix } from "../index.js";
import type { IPrivateKey } from "../types/IPrivateKey.js";

/**
 * Returns the public key from the private key using the secp256k1 curve.
 */
const getPublicKey = (privateKey: IPrivateKey): Hex => {
  const publicKey = secp256k1.getPublicKey(removeHexPrefix(privateKey), false);
  return addHexPrefix(bytesToHex(publicKey));
};

export { getPublicKey };
