import type { ISerializer } from "./ISerializer.js";
import type { ISigner } from "./ISigner.js";

/**
 * Client configuration that is shared between public and private clients.
 */
type IClientBaseConfig = {
  /**
   * The endpoint of the network. It is a URL of the network node.
   * @example 'http://127.0.0.1:8529'
   */
  endpoint: string;
};

type IPublicClientConfig = IClientBaseConfig;

type IWalletClientConfig = IClientBaseConfig & {
  /**
   * The instance of signer is used to sign transactions and messages.
   * If not included in the config, messages should be signed before passing to the client.
   * @example
   * import { Signer } from 'niljs';
   *
   * const signer = new Signer();
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529',
   *  signer: signer
   * })
   */
  signer?: ISigner;
  /**
   * The instance of serializer is used to serialize and deserialize data.
   * If not included in the config, data should be serialized and deserialized before passing to the client.
   * @example
   * import { Serializer } from 'niljs';
   *
   * const serializer = new Serializer();
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529',
   *  serializer: serializer
   * })
   */
  serializer?: ISerializer;
};

export type { IClientBaseConfig, IPublicClientConfig, IWalletClientConfig };
