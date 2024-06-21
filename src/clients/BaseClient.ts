import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import type { ITransport } from "../transport/index.js";
import { assertIsValidShardId } from "../utils/assert.js";
import type { IClientBaseConfig } from "./types/ClientConfigs.js";



/**
 * BaseClient is the base class for any client tasked with interacting with =nil; *
 * @class BaseClient
 * @typedef {BaseClient}
 */
class BaseClient {
  /**
   * The ITransport to be used in the client.
   *
   * @protected
   * @type {ITransport}
   */
  protected transport: ITransport;
  /**
   * The id of the shard with which the client needs to interact.
   * The shard with this id will be used in every call made by the client.
   * @protected
   * @type {number}
   */
  protected shardId: number;

  /**
   * Creates an instance of BaseClient.
   * @constructor
   * @param {IClientBaseConfig} config The config to be used in the client. It contains the transport and the shard id.
   */
  constructor(config: IClientBaseConfig) {
    this.transport = config.transport;
    this.shardId = config.shardId;
  }

  /**
   * Sends a request.
   * @param requestObject The request object. It contains the method and parameters.
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
   * @param shardId The shard id.
   * @throws Will throw an error if provided the shard id is invalid.
   * @example
   * client.setShardId(1);
   */
  public setShardId(shardId: number): void {
    assertIsValidShardId(shardId);

    this.shardId = shardId;
  }
}

export { BaseClient };
