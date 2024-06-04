import type { ISigner } from "../../signers/types/ISigner.js";

/**
 * Client configuration that is shared between public and private clients.
 */
type IClientBaseConfig = {
  /**
   * The endpoint of the network. It is a URL of the network node.
   * @example 'http://127.0.0.1:8529'
   */
  endpoint: string;
  /**
   * The shardId is used to specify the shard in every call.
   * @example 0
   * @default 0
   */
  shardId: number;
  /**
   * The polling interval is used to poll the network for new data.
   * @example 1000
   * @default 1000
   */
  pollingInterval?: number;
  /**
   * The timeout is used to set the timeout for the request.
   * If the request is not completed within the timeout, it will be rejected.
   * @example 1000
   * @default 20000
   */
  timeout?: number;
};

type IPublicClientConfig = IClientBaseConfig;

type IWalletClientConfig = IClientBaseConfig & {
  /**
   * The instance of signer is used to sign messages and messages.
   * If not included in the config, messages should be signed before passing to the client.
   * @example
   * import { Signer } from '@nilfoundation/niljs';
   *
   * const signer = new Signer();
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529',
   *  signer: signer
   * })
   */
  signer: ISigner;
};

export type { IClientBaseConfig, IPublicClientConfig, IWalletClientConfig };
