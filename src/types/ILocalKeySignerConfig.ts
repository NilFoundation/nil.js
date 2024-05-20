import type { IPrivateKey } from "./IPrivateKey.js";

/**
 * Interface for the configuration object of the LocalKeySigner.
 */
type ILocalKeySignerConfig = {
  /**
   * Private key to sign the data.
   * @example '0x4b3b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f'
   */
  privateKey: IPrivateKey;
};

export type { ILocalKeySignerConfig };
