import { mnemonicToSeedSync } from "@scure/bip39";
import { toHex } from "../encoding/toHex.js";
import { addHexPrefix } from "../utils/hex.js";
import type { Hex } from "./index.js";

/**
 * Generate the private key from the mnemonic phrase.
 * @param mnemonic The ,nemonic phrase to generate the private key from.
 * @param password The password to generate the private key.
 * @returns The private key.
 */
const privateKeyFromPhrase = (mnemonic: string): Hex => {
  return addHexPrefix(toHex(mnemonicToSeedSync(mnemonic).slice(0, 32)));
};

export { privateKeyFromPhrase };
