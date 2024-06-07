import { type Hex, bytesToHex } from "@noble/curves/abstract/utils";
import {
  type IBlock,
  type IReceipt,
  addHexPrefix,
  hexToBigInt,
} from "../index.js";
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
  public async getBlockByHash(hash: Hex, fullTx = false) {
    const res = await this.request<IBlock>({
      method: "eth_getBlockByHash",
      params: [this.shardId, hash, fullTx],
    });

    return res;
  }

  /**
   * getBlockByHash returns the block by the block hash.
   * @param hash - The block hash.
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
  public async getBlockByNumber(blockNumber: string, fullTx = false) {
    const res = await this.request<IBlock>({
      method: "eth_getBlockByNumber",
      params: [this.shardId, blockNumber, fullTx],
    });

    return res;
  }

  /**
   * getBlockMessageCountByNumber returns the message count by the block number.
   * @param number - The block number.
   * @returns The message count.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockMessageCountByNumber(1);
   *
   */
  public async getBlockMessageCountByNumber(blockNumber: string) {
    const res = await this.request<number>({
      method: "eth_getBlockTransactionCountByNumber",
      params: [this.shardId, blockNumber],
    });

    return res;
  }

  /**
   * getBlockMessageCountByHash returns the message count by the block hash.
   * @param hash - The block hash.
   * @returns The message count.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockMessageCountByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getBlockMessageCountByHash(hash: Hex) {
    const res = await this.request<number>({
      method: "eth_getBlockTransactionCountByHash",
      params: [this.shardId, hash],
    });

    return res;
  }

  /**
   * getCode returns the bytecode of the contract.
   * @param address - The contract address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The code of the contract.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const code = await client.getCode(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getCode(address: IAddress, blockNumberOrHash: Hex) {
    const res = await this.request<Uint8Array>({
      method: "eth_getCode",
      params: [this.shardId, address, blockNumberOrHash],
    });

    return res;
  }

  /**
   * getMessageCount returns the message count of the address.
   * @param address - The address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The message count.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getMessageCount(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   *
   */
  public async getMessageCount(address: IAddress, blockNumberOrHash: string) {
    console.log("adress", address);
    const res = await this.request<string>({
      method: "eth_getTransactionCount",
      params: [address, blockNumberOrHash],
    });
    console.log("res", res, blockNumberOrHash);

    return Number.parseInt(res.slice(2), 16);
  }

  /**
   * getBalance returns the balance of the address.
   * @param address - The address.
   * @param blockNumberOrHash - The block number or hash.
   * @returns The balance of the address.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const balance = await client.getBalance(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getBalance(address: IAddress, blockNumberOrHash: Hex) {
    const hexAddress = addHexPrefix(address);
    const res = await this.request<`0x${string}`>({
      method: "eth_getBalance",
      params: [hexAddress, blockNumberOrHash],
    });

    return hexToBigInt(res);
  }

  /**
   * getMessageByHash returns the message by the hash.
   * @param hash - The hash.
   * @returns The message.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = await client.getMessageByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getMessageByHash(hash: Hex, shardId?: number) {
    const res = await this.request<Uint8Array>({
      method: "eth_getInMessageByHash",
      params: [shardId ?? this.shardId, hash],
    });

    return res;
  }

  /**
   * getMessageReceiptByHash returns the message receipt by the hash.
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
  public async getMessageReceiptByHash(hash: Hex, shardId?: number) {
    if (typeof hash === "string") {
      return this.request<IReceipt>({
        method: "eth_getInMessageReceipt",
        params: [shardId ?? this.shardId, addHexPrefix(hash)],
      });
    }

    return this.request<IReceipt>({
      method: "eth_getInMessageReceipt",
      params: [shardId ?? this.shardId, addHexPrefix(bytesToHex(hash))],
    });
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
   */
  public async sendRawMessage(message: Hex) {
    const res = await this.request<Uint8Array>({
      method: "eth_sendRawTransaction",
      params: [message],
    });

    return res;
  }

  /**
   * getGasPrice returns the gas price in wei.
   * @returns The gas price.
   */
  public async getGasPrice(): Promise<bigint> {
    const stubGasPrice = BigInt(1);

    return stubGasPrice;
  }

  /**
   * estimateGasLimit returns the gas limit.
   * @returns The gas limit.
   */
  public async estimateGasLimit(): Promise<bigint> {
    const stubGasLimit = BigInt(1000000);

    return stubGasLimit;
  }
}

export { PublicClient };
