import type { Hex } from "@noble/curves/abstract/utils";
import type { IReceipt } from "../index.js";
import type { IAddress } from "../signers/types/IAddress.js";
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
   * @param shardId - The shard id.
   * @param number - The block number.
   * @param fullTx - The flag to include full transactions.
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
  public async getBlockByHash(
    shardId: number,
    hash: Hex,
    fullTx = false,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockByHash",
      params: [shardId, hash, fullTx],
    });

    return res;
  }

  /**
   * getBlockByNumber returns the block by the block number.
   * @param shardId - The shard id.
   * @param number - The block number.
   * @param fullTx - The flag to include full transactions.
   * @returns The block.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const block = await client.getBlockByNumber('0x1');
   */
  public async getBlockByNumber(
    shardId: number,
    blockNumber: string,
    fullTx = false,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockByNumber",
      params: [shardId, blockNumber, fullTx],
    });

    return res;
  }

  /**
   * getBlockMessageCountByNumber returns the message count by the block number.
   * @param shardId - The shard id.
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
  public async getBlockMessageCountByNumber(
    shardId: number,
    blockNumber: string,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [shardId, blockNumber],
    });

    return res;
  }

  /**
   * getBlockMessageCountByHash returns the message count by the block hash.
   * @param shardId - The shard id.
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
  public async getBlockMessageCountByHash(
    shardId: number,
    hash: Hex,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getBlockTransactionCountByHash",
      params: [shardId, hash],
    });

    return res;
  }

  /**
   * getCode returns the bytecode of the contract.
   * @param shardId - The shard id.
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
    shardId: number,
    address: IAddress,
    blockNumberOrHash: Hex,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getCode",
      params: [shardId, address, blockNumberOrHash],
    });

    return res;
  }

  /**
   * getMessageCount returns the message count of the address.
   * @param shardId - The shard id.
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
    shardId: number,
    address: IAddress,
    blockNumberOrHash: string,
  ): Promise<number> {
    const res = await this.rpcClient.request({
      method: "eth_getTransactionCount",
      params: [shardId, address, blockNumberOrHash],
    });

    return res;
  }

  /**
   * getBalance returns the balance of the address.
   * @param shardId - The shard id.
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
    shardId: number,
    address: IAddress,
    blockNumberOrHash: Hex,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getBalance",
      params: [shardId, address, blockNumberOrHash],
    });

    return res;
  }

  /**
   * getMessageByHash returns the message by the hash.
   * @param shardId - The shard id.
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
  public async getMessageByHash(
    shardId: number,
    hash: Hex,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_getInMessageByHash",
      params: [shardId, hash],
    });

    return res;
  }

  /**
   * getMessageReceiptByHash returns the message receipt by the hash.
   * @param shardId - The shard id.
   * @param hash - The hash.
   * @returns The message receipt.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   * endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const receipt = await client.getMessageReceiptByHash(1, Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getMessageReceiptByHash(
    shardId: number,
    hash: Hex,
  ): Promise<IReceipt> {
    const res = await this.rpcClient.request({
      method: "eth_getInMessageReceipt",
      params: [shardId, hash],
    });

    return res;
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
  public async sendRawMessage(message: Hex): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_sendRawTransaction",
      params: [message],
    });

    return res;
  }

  /**
   * getGasPrice returns the gas price in wei.
   * @returns The gas price.
   */
  public async getGasPrice(shardId: number): Promise<bigint> {
    const stubGasPrice = BigInt(1000000000);

    return stubGasPrice;
  }
}

export { PublicClient };
