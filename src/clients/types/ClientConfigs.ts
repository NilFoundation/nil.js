import type { ITransport } from "../../index.js";
import type { ISigner } from "../../signers/types/ISigner.js";

/**
 * Client configuration that is shared between public and private clients.
 */
type IClientBaseConfig = {
  /**
   * The transport is used to send requests to the network.
   * @example
   * import { MetaMaskTransport } from '@nilfoundation/niljs';
   *
   * const transport = new MetaMaskTransport();
   *
   * const client = new PublicClient({ transport, shardId: 1 });
   */
  transport: ITransport;
};

type IPublicClientConfig = IClientBaseConfig;

type IWalletClientConfig = IClientBaseConfig & {
  /**
   * The shardId is used to specify the shard in every call.
   * @example 0
   */
  shardId: number;
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
