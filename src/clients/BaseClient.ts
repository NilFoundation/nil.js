import type { Client as RPCClient } from "@open-rpc/client-js";
import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import { assertIsValidShardId } from "../index.js";
import { createRPCClient } from "../rpc/rpcClient.js";
import type { IClientBaseConfig } from "./types/ClientConfigs.js";

class BaseClient {
  /**
   * RPC client instance.
   */
  protected rpcClient: RPCClient;
  protected shardId: number;
  private timeout: number;

  constructor(config: IClientBaseConfig) {
    this.rpcClient = createRPCClient(config.endpoint);
    this.timeout = config.timeout !== undefined ? config.timeout : 20000;
    this.shardId = config.shardId;
  }

  /**
   * Sends a request.
   * @param requestObject - The request object. It contains the method and parameters.
   * @returns The response.
   */
  protected async request<T>(requestObject: RequestArguments): Promise<T> {
    return this.rpcClient.request(requestObject, this.timeout);
  }

  /**
   * Closes the connection to the network.
   */
  public closeConnection(): void {
    this.rpcClient.close();
  }

  /**
   * Returns the shard id.
   * @returns The shard id.
   */
  public getShardId(): number {
    return this.shardId;
  }

  /**
   * Sets the shard id.
   * @param shardId - The shard id.
   * @throws Will throw an error if the shard id is invalid.
   * @example
   * client.setShardId(1);
   */
  public setShardId(shardId: number): void {
    assertIsValidShardId(shardId);

    this.shardId = shardId;
  }
}

export { BaseClient };
