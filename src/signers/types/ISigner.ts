/**
 * Interface for the Signer class
 */
interface ISigner {
  /**
   * Signs the data.
   * Accepts valid data as an argument and returns the signature.
   * @param data - The data to sign.
   * @example
   * const data = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const recoveredSignature = signer.sign(data);
   */
  sign(data: Uint8Array): Promise<Uint8Array>;
  /**
   * Returns the address.
   * @param shardId - The shard id.
   * @returns The address.
   * @example
   * const address = signer.getAddress();
   */
  getPublicKey(params: unknown): Promise<Uint8Array>;
  /**
   * Returns the address.
   * @param shardId - The shard id.
   * @returns The address.
   * @example
   * const address = signer.getAddress();
   */
  getAddress(params: unknown): Promise<Uint8Array>;
}

export type { ISigner };
