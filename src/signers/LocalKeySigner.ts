import { secp256k1 } from "@noble/curves/secp256k1";
import { toHex } from "../encoding/toHex.js";
import { assertIsHexString, assertIsValidPrivateKey } from "../utils/assert.js";
import { getPublicKey } from "./publicKey.js";
import type { ILocalKeySignerConfig } from "./types/ILocalKeySignerConfig.js";
import type { ISignature } from "./types/ISignature.js";
import type { ISigner } from "./types/ISigner.js";

/**
 * LocalKeySigner is a class that allows you to sign the data with the private key.
 * It is an abstraction of signing the data with the private key.
 * It uses the secp256k1 curve implementation by @noble/curves/secp256k1 library under the hood.
 * @example
 * import { LocalKeySigner, generatePrivateKey } from 'niljs';
 *
 * const privateKey = genratePrivateKey();
 * const signer = new LocalKeySigner({ privateKey });
 */
class LocalKeySigner implements ISigner {
  private publicKey;
  private privateKey;

  constructor(config: ILocalKeySignerConfig) {
    const { privateKey } = config;
    assertIsValidPrivateKey(privateKey);

    const publicKey = getPublicKey(privateKey);
    assertIsHexString(publicKey);

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  public sign(data: Uint8Array): ISignature {
    const signature = secp256k1.sign(data, this.privateKey);

    const { r, s, recovery } = signature;
    return {
      r: toHex(r),
      s: toHex(s),
      v: recovery ? 28n : 27n,
      yParity: recovery,
    };
  }

  public getPublicKey() {
    return this.publicKey;
  }
}

export { LocalKeySigner };
