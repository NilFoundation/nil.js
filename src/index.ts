export { PublicClient } from "./clients/PublicClient.js";
export { WalletClient } from "./clients/WalletClient.js";
export type {
  IPublicClientConfig,
  IWalletClientConfig,
} from "./types/ClientConfigs.ts";
export { Serializer } from "./encoding/Serializer.js";
export { LocalKeySigner } from "./signers/LocalKeySigner.js";
export * from "./utils/hex.js";
export * from "./utils/transaction.js";

// what is format of our transaction?
// first, serialize body of tx
// than sign it
// than serialize signature+serizalized body
// than send it to the network as hex data

// we also need a schema for ssz
