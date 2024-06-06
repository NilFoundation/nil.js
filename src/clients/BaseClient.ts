import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import { type ITransport, assertIsValidShardId } from "../index.js";
import type { IClientBaseConfig } from "./types/ClientConfigs.js";

class BaseClient {
  protected transport: ITransport;
  protected shardId: number;

  constructor(config: IClientBaseConfig) {
    this.transport = config.transport;
    this.shardId = config.shardId;
  }

  /**
   * Sends a request.
   * @param requestObject - The request object. It contains the method and parameters.
   * @returns The response.
   */
  protected async request<T>(requestObject: RequestArguments): Promise<T> {
    return this.transport.request(requestObject);
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
