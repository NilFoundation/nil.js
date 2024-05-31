import type { Hex } from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import { addHexPrefix, removeHexPrefix } from "../index.js";
import {
  assertIsAddress,
  assertIsHexString,
  assertIsValidPrivateKey,
} from "../utils/assert.js";
import { getAddressFromPublicKey, getPublicKey } from "./publicKey.js";
import type { IAddress } from "./types/IAddress.js";
import type { ILocalKeySignerConfig } from "./types/ILocalKeySignerConfig.js";
import type { ISignature } from "./types/ISignature.js";
import type { ISigner } from "./types/ISigner.js";

/**
 * LocalKeySigner is a class that allows you to sign the data with the private key.
 * It is an abstraction of signing the data with the private key.
 * It uses the secp256k1 curve implementation by @noble/curves/secp256k1 library under the hood.
 * @example
 * import { LocalKeySigner, generatePrivateKey } from '@nilfoundation/niljs';
 *
 * const privateKey = genratePrivateKey();
 * const signer = new LocalKeySigner({ privateKey });
 */
class LocalKeySigner implements ISigner {
  private privateKey;
  private publicKey?: Hex = undefined;
  private address?: IAddress = undefined;

  constructor(config: ILocalKeySignerConfig) {
    const privateKey = addHexPrefix(config.privateKey);
    assertIsValidPrivateKey(privateKey);

    this.privateKey = privateKey;
  }

  public sign(data: Uint8Array): ISignature {
    const signature = secp256k1.sign(
      removeHexPrefix(data),
      removeHexPrefix(this.privateKey),
    );

    const { r, s, recovery } = signature;
    return {
      r,
      s,
      v: recovery,
    };
  }

  public getPublicKey() {
    if (this.publicKey) {
      return this.publicKey;
    }

    const publicKey = getPublicKey(this.privateKey);
    assertIsHexString(publicKey);

    this.publicKey = publicKey;
    return this.publicKey;
  }

  public getAddress() {
    if (this.address) {
      return this.address;
    }

    this.address = getAddressFromPublicKey(this.getPublicKey());
    assertIsAddress(this.address);

    return this.address;
  }
}

export { LocalKeySigner };
