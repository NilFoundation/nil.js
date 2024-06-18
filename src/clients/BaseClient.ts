import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import type { ITransport } from "../transport/index.js";
import type { IClientBaseConfig } from "./types/ClientConfigs.js";

class BaseClient {
  protected transport: ITransport;

  constructor(config: IClientBaseConfig) {
    this.transport = config.transport;
  }

  /**
   * Sends a request.
   * @param requestObject - The request object. It contains the method and parameters.
   * @returns The response.
   */
  protected async request<T>(requestObject: RequestArguments): Promise<T> {
    return this.transport.request(requestObject);
  }
}

export { BaseClient };
