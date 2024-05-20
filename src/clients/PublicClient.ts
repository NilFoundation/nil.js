import type { IPublicClientConfig } from "../types/ClientConfigs.js";
import { BaseClient } from "./BaseClient.js";

/**
 * Public client is a class that allows you to interact with the network via JSON-RPC api.
 * It is an abstraction of connection to the Nil network.
 * Public client alllows to use api that does not require signing data and private key usage.
 * @example
 * import { PublicClient } from 'niljs';
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
   import { PublicClient } from 'niljs';
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
   import { PublicClient } from 'niljs';
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
   * getBlockTransactionCountByNumber returns the transaction count by the block number.
   * @param number - The block number.
   * @returns The transaction count.
   * @example
   import { PublicClient } from 'niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockTransactionCountByNumber(1);
   */
  public async getBlockTransactionCountByNumber(
    number: number,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [number],
    });

    return res.result;
  }

  /**
   * getBlockTransactionCountByHash returns the transaction count by the block hash.
   * @param hash - The block hash.
   * @returns The transaction count.
   * @example
   import { PublicClient } from 'niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockTransactionCountByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getBlockTransactionCountByHash(
    hash: Uint8Array,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockTransactionCountByHash",
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
   import { PublicClient } from 'niljs';
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
   * getTransactionCount returns the transaction count of the address.
   * @param address - The address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The transaction count.
   * @example
   import { PublicClient } from 'niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getTransactionCount(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getTransactionCount(
    address: Uint8Array,
    blockNumberOrHash: string,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getTransactionCount",
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
   import { PublicClient } from 'niljs';
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
   import { PublicClient } from 'niljs';
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
}

export { PublicClient };
