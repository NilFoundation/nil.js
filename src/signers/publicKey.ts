import { type Hex, bytesToHex } from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { type ISignature, addHexPrefix, removeHexPrefix } from "../index.js";
import { keccak_256 } from "../utils/keccak256.js";
import type { IAddress } from "./types/IAddress.js";
import type { IPrivateKey } from "./types/IPrivateKey.js";

/**
 * Returns the public key from the private key using the secp256k1 curve.
 */
const getPublicKey = (privateKey: IPrivateKey, isCompressed = false): Hex => {
  const publicKey = secp256k1.getPublicKey(
    removeHexPrefix(privateKey),
    isCompressed,
  );
  return addHexPrefix(bytesToHex(publicKey));
};

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
  const bytes = keccak_256(publicKey).slice(-20);
  return addHexPrefix(bytesToHex(bytes));
};

export { getPublicKey, recoverPublicKey, getAddressFromPublicKey };
