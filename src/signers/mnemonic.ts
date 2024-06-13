import { mnemonicToSeedSync } from "@scure/bip39";
import { toHex } from "../encoding/toHex.js";
import { addHexPrefix } from "../utils/hex.js";
import type { IPrivateKey } from "./index.js";

/**
 * Generate private key from mnemonic phrase.
 * @param mnemonic - Mnemonic phrase to generate private key from it
 * @param password - Password to generate private key
 * @returns Private key
 */
const privateKeyFromPhrase = (mnemonic: string): IPrivateKey => {
  return addHexPrefix(toHex(mnemonicToSeedSync(mnemonic).slice(0, 32)));
};

export { privateKeyFromPhrase };
