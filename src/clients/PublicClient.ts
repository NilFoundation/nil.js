import type { IReceipt } from "../index.js";
import { BaseClient } from "./BaseClient.js";
import type { IPublicClientConfig } from "./types/ClientConfigs.js";

/**
 * Public client is a class that allows you to interact with the network via JSON-RPC api.
 * It is an abstraction of connection to the Nil network.
 * Public client alllows to use api that does not require signing data and private key usage.
 * @example
 * import { PublicClient } from '@nilfoundation/niljs';
 *
 * const client = new PublicClient({
 *  endpoint: 'http://127.0.0.1:8529'
 * })
 */
class PublicClient extends BaseClient {
  // biome-ignore lint/complexity/noUselessConstructor: may be useful in the future
  constructor(config: IPublicClientConfig) {
    super(config);
  }

  /**
   * getBlockByNumber returns the block by the block number.
   * @param number - The block number.
   * @returns The block.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const block = await client.getBlockByNumber(1);
   */
  public async getBlockByHash(hash: Uint8Array): Promise<Uint8Array> {
    const block = await this.rpcClient.request({
      method: "eth_getBlockByHash",
      params: [hash, true],
    });

    return block;
  }

  /**
   * getBlockByNumber returns the block by the block number.
   * @param number - The block number.
   * @returns The block.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const block = await client.getBlockByNumber(1);
   */
  public async getBlockByNumber(number: number): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockByNumber",
      params: [number, true],
    });

    return res.result;
  }

  /**
   * getBlockMessageCountByNumber returns the message count by the block number.
   * @param number - The block number.
   * @returns The message count.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockMessageCountByNumber(1);
   */
  public async getBlockMessageCountByNumber(number: number): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockMessageCountByNumber",
      params: [number],
    });

    return res.result;
  }

  /**
   * getBlockMessageCountByHash returns the message count by the block hash.
   * @param hash - The block hash.
   * @returns The message count.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockMessageCountByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getBlockMessageCountByHash(hash: Uint8Array): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockMessageCountByHash",
      params: [hash],
    });

    return res.result;
  }

  /**
   * getCode returns the code of the contract.
   * @param address - The contract address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The code of the contract.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const code = await client.getCode(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getCode(
    address: Uint8Array,
    blockNumberOrHash: string,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getCode",
      params: [address, blockNumberOrHash],
    });

    return res.result;
  }

  /**
   * getMessageCount returns the message count of the address.
   * @param address - The address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The message count.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getMessageCount(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getMessageCount(
    address: Uint8Array,
    blockNumberOrHash: string,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getMessageCount",
      params: [address, blockNumberOrHash],
    });

    return res.result;
  }

  /**
   * getBalance returns the balance of the address.
   * @param address - The address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The balance of the address.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const balance = await client.getBalance(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getBalance(
    address: Uint8Array,
    blockNumberOrHash: string,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getBalance",
      params: [address, blockNumberOrHash],
    });

    return res.result;
  }

  /**
   * getMessageByHash returns the message by the hash.
   * @param hash - The hash.
   * @returns The message.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = await client.getMessageByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getMessageByHash(hash: Uint8Array): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getMessageByHash",
      params: [hash],
    });

    return res.result;
  }

  /**
   * getMessageReceiptByHash returns the message receipt by the hash.
   * @param shardId - The shard id.
   * @param hash - The hash.
   * @returns The message receipt.
   */
  public async getMessageReceiptByHash(
    shardId: number,
    hash: Uint8Array,
  ): Promise<IReceipt> {
    const res = await this.rpcClient.request({
      method: "eth_getMessageReceipt",
      params: [shardId, hash],
    });

    return res.result;
  }

  /**
   * sendRawMessage sends a raw message to the network.
   * @param message - The message to send.
   * @returns The hash of the message.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.sendRawMessage(message);
   */
  public async sendRawMessage(message: Uint8Array): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_sendRawMessage",
      params: [message],
    });

    return res.hash;
  }
}

export { PublicClient };
