import {
  type Hex,
  concatBytes,
  numberToBytesBE,
} from "@noble/curves/abstract/utils";
import { secp256k1 } from "@noble/curves/secp256k1";
import invariant from "tiny-invariant";
import {
  assertIsAddress,
  assertIsHexString,
  assertIsValidPrivateKey,
} from "../utils/assert.js";
import { addHexPrefix, removeHexPrefix } from "../utils/hex.js";
import { privateKeyFromPhrase } from "./mnemonic.js";
import { getAddressFromPublicKey, getPublicKey } from "./publicKey.js";
import type { IAddress } from "./types/IAddress.js";
import type { ILocalKeySignerConfig } from "./types/ILocalKeySignerConfig.js";
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
class LocalECDSAKeySigner implements ISigner {
  private privateKey;
  private publicKey?: Hex = undefined;
  private address?: IAddress = undefined;

  constructor(config: ILocalKeySignerConfig) {
    const { privateKey, mnemonic } = config;

    invariant(
      privateKey || mnemonic,
      "Either privateKey or mnemonic must be provided.",
    );

    const privKey = mnemonic
      ? privateKeyFromPhrase(mnemonic)
      : addHexPrefix(privateKey as string);

    assertIsValidPrivateKey(privKey);

    this.privateKey = privKey;
  }

  public async sign(data: Uint8Array): Promise<Uint8Array> {
    const signature = secp256k1.sign(data, removeHexPrefix(this.privateKey));
    const { r, s, recovery } = signature;

    return concatBytes(
      numberToBytesBE(r, 32),
      numberToBytesBE(s, 32),
      numberToBytesBE(recovery, 1),
    );
  }

  public getPublicKey() {
    if (this.publicKey) {
      return this.publicKey;
    }

    const publicKey = getPublicKey(this.privateKey, true);
    assertIsHexString(publicKey);

    this.publicKey = publicKey;
    return this.publicKey;
  }

  public async getAddress(shardId: number) {
    if (this.address) {
      return this.address;
    }

    this.address = getAddressFromPublicKey(this.getPublicKey(), shardId);
    assertIsAddress(this.address);

    return this.address;
  }
}

export { LocalECDSAKeySigner };
