import type { Hex } from "@noble/curves/abstract/utils";
import type { ISignature } from "./ISignature.js";

/**
 * Interface for the Signer class
 */
abstract class ISigner {
  /**
   * Signs the data.
   * Accepts valid data as an argument and returns the signature.
   * @param data - The data to sign.
   * @example
   * const data = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const recoveredSignature = signer.sign(data);
   */
  abstract sign(data: Uint8Array): ISignature;
  /**
   * Returns the public key.
   * @returns The public key.
   * @example
   * const publicKey = signer.getPublicKey();
   */
  abstract getPublicKey(): Hex;
}

export { ISigner };
