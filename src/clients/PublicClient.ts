import { bytesToHex } from "@noble/curves/abstract/utils";
import { hexToBytes } from "viem";
import { hexToBigInt, hexToNumber } from "../encoding/index.js";
import { BlockNotFoundError } from "../errors/rpcErrors.js";
import type { Hex } from "../index.js";
import type { IAddress } from "../signers/types/IAddress.js";
import type { Block, BlockTag } from "../types/Block.js";
import type { IReceipt } from "../types/IReceipt.js";
import { addHexPrefix } from "../utils/hex.js";
import { BaseClient } from "./BaseClient.js";
import type { IPublicClientConfig } from "./types/ClientConfigs.js";

/**
 * PublicClient is a class that allows for interacting with the network via the JSON-RPC API.
 * It provides an abstraction of the connection to =nil;
 * PublicClient enables using API requests that do not require signing data (or otherwise using one's private key).
 * @example
 * import { PublicClient } from '@nilfoundation/niljs';
 *
 * const client = new PublicClient({
 *  endpoint: 'http://127.0.0.1:8529'
 * })
 */
class PublicClient extends BaseClient {
  // biome-ignore lint/complexity/noUselessConstructor: may be useful in the future
  /**
   * Creates an instance of PublicClient.
   *
   * @constructor
   * @param {IPublicClientConfig} config The config to be used in the client.
   */
  constructor(config: IPublicClientConfig) {
    super(config);
  }

  /**
   * Returns the block with the given hash.
   * @param hash The hash of the block whose information is requested.
   * @param fullTx The flag that determines whether full transaction information is returned in the output.
   * @param shardId The ID of the shard where the block was generated.
   * @returns Information about the block with the given hash.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const block = await client.getBlockByHash(0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08);
   */
  public async getBlockByHash(
    hash: Hex,
    fullTx = false,
    shardId = this.shardId,
  ) {
    try {
      return await this.request<Block>({
        method: "eth_getBlockByHash",
        params: [shardId, hash, fullTx],
      });
    } catch (error) {
      throw new BlockNotFoundError({
        blockNumberOrHash: hash,
        cause: error,
      });
    }
  }

  /**
   * Returns the block with the given number.
   * @param blockNumber The number of the block whose information is requested.
   * @param fullTx The flag that determines whether full transaction information is returned in the output.
   * @param shardId The ID of the shard where the block was generated.
   * @returns Returns information about a block with the given number.
   * @example
   import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const block = await client.getBlockByNumber(1);
   */
  public async getBlockByNumber(
    blockNumber: Hex,
    fullTx = false,
    shardId = this.shardId,
  ) {
    try {
      return await this.request<Block>({
        method: "eth_getBlockByNumber",
        params: [shardId, blockNumber, fullTx],
      });
    } catch (error) {
      throw new BlockNotFoundError({
        blockNumberOrHash: blockNumber,
        cause: error,
      });
    }
  }

  /**
   * Returns the total number of messages recorded in the block with the given number.
   * @param number The number of the block whose information is requested.
   * @returns The number of messages contained within the block.
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
  public async getBlockMessageCountByNumber(
    blockNumber: string,
    shardId = this.shardId,
  ) {
    const res = await this.request<number>({
      method: "eth_getBlockTransactionCountByNumber",
      params: [shardId, blockNumber],
    });

    return res;
  }

  /**
   * Returns the total number of messages recorded in the block with the given hash.
   * @param hash The hash of the block whose information is requested.
   * @param shardId The ID of the shard where the block was generated.
   * @returns The number of messages contained within the block.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const count = await client.getBlockMessageCountByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getBlockMessageCountByHash(hash: Hex, shardId = this.shardId) {
    const res = await this.request<number>({
      method: "eth_getBlockTransactionCountByHash",
      params: [shardId, hash],
    });

    return res;
  }

  /**
   * Returns the bytecode of the contract with the given address and at the given block.
   * @param address The address of the account or contract.
   * @param blockNumberOrHash The number/hash of the block.
   * @param shardId The ID of the shard where the block was generated.
   * @returns The bytecode of the contract.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const code = await client.getCode(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 'latest');
   */
  public async getCode(address: IAddress, blockNumberOrHash: Hex | BlockTag) {
    const res = await this.request<`0x${string}`>({
      method: "eth_getCode",
      params: [address, blockNumberOrHash],
    });
    return hexToBytes(res);
  }

  /**
   * Returns the transaction count of the account with the given address and at the given block.
   * @param address The address of the account or contract.
   * @param blockNumberOrHash The number/hash of the block.
   * @returns The number of transactions contained within the block.
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
  public async getMessageCount(
    address: IAddress,
    blockNumberOrHash: Hex | BlockTag,
  ) {
    const res = await this.request<Hex>({
      method: "eth_getTransactionCount",
      params: [address, blockNumberOrHash],
    });

    return hexToNumber(res);
  }

  /**
   * Returns the balance of the given address and at the given block.
   * @param address The address of the account or contract.
   * @param blockNumberOrHash The number/hash of the block.
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
  public async getBalance(
    address: IAddress,
    blockNumberOrHash: Hex | BlockTag,
  ) {
    const res = await this.request<`0x${string}`>({
      method: "eth_getBalance",
      params: [addHexPrefix(address), blockNumberOrHash],
    });

    return hexToBigInt(res);
  }

  /**
   * Returns the structure of the internal message with the given hash.
   * @param hash - The hash of the message.
   * @param shardId - The ID of the shard where the message was recorded.
   * @returns The message whose information is requested.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = await client.getMessageByHash(Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getMessageByHash(hash: Hex, shardId = this.shardId) {
    const res = await this.request<Uint8Array>({
      method: "eth_getInMessageByHash",
      params: [shardId, hash],
    });

    return res;
  }

  /**
   * Returns the receipt for the message with the given hash.
   * @param hash - The hash of the message.
   * @param shardId - The ID of the shard where the message was recorded.
   * @returns The receipt whose structure is requested.
   * @example
   * import { PublicClient } from '@nilfoundation/niljs';
   *
   * const client = new PublicClient({
   * endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const receipt = await client.getMessageReceiptByHash(1, Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
   */
  public async getMessageReceiptByHash(hash: Hex, shardId = this.shardId) {
    const res = await this.request<IReceipt | null>({
      method: "eth_getInMessageReceipt",
      params: [
        shardId,
        typeof hash === "string"
          ? addHexPrefix(hash)
          : addHexPrefix(bytesToHex(hash)),
      ],
    });

    return res;
  }

  /**
   * Creates a new message or creates a contract for a previously signed message.
   * @param message - The encoded bytecode of the message.
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
  public async sendRawMessage(message: `0x${string}` | Uint8Array) {
    let hexMessage: `0x${string}`;
    if (typeof message !== "string") {
      hexMessage = `0x${bytesToHex(message)}`;
    } else {
      hexMessage = message;
    }
    const res = await this.request<Uint8Array>({
      method: "eth_sendRawTransaction",
      params: [hexMessage],
    });

    return res;
  }

  /**
   * Returns the gas price in wei.
   * @returns The gas price.
   */
  public async getGasPrice(): Promise<bigint> {
    const stubGasPrice = BigInt(1);

    return stubGasPrice;
  }

  /**
   * Returns the gas limit.
   * @returns The gas limit.
   */
  public async estimateGasLimit(): Promise<bigint> {
    const stubGasLimit = BigInt(1000000);

    return stubGasLimit;
  }

  /**
   * Returns the chain id.
   * @returns The chain id.
   */
  public async chainId(): Promise<number> {
    const res = await this.request<Hex>({
      method: "eth_chainId",
      params: [],
    });
    return hexToNumber(res);
  }
}

export { PublicClient };
