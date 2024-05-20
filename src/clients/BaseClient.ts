import type { Client as RPCClient } from "@open-rpc/client-js";
import { createRPCClient } from "../rpc/rpcClient.js";
import type { IClientBaseConfig } from "../types/ClientConfigs.js";

class BaseClient {
  /**
   * RPC client instance.
   */
  protected rpcClient: RPCClient;

  constructor(config: IClientBaseConfig) {
    this.rpcClient = createRPCClient(config.endpoint);
  }

  /**
   * Closes the connection to the network.
   */
  public closeConnection(): void {
    this.rpcClient.close();
  }
}

export { BaseClient };
