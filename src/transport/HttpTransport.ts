import type { Client as RPCClient } from "@open-rpc/client-js";
import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import { createRPCClient } from "../rpc/rpcClient.js";
import { startPollingUntilCondition } from "../utils/polling.js";
import type { IHttpTransportConfig } from "./types/IHttpTransportConfig.js";
import type { ITransport } from "./types/ITransport.js";

class HttpTransport implements ITransport {
  private rpcClient: RPCClient;
  private timeout: number;
  private pollingInterval: number;

  constructor(config: IHttpTransportConfig) {
    this.rpcClient = createRPCClient(config.endpoint);
    this.timeout = config.timeout !== undefined ? config.timeout : 20000;
    this.pollingInterval = config.pollingInterval ?? 1000;
  }

  public async request<T>(requestObject: RequestArguments): Promise<T> {
    return this.rpcClient.request(requestObject, this.timeout);
  }

  public connect(): void {
    //
  }

  public closeConnection(): void {
    this.rpcClient.close();
  }

  public startPollingUntil<T>(
    cb: () => Promise<T>,
    condition: (result: T) => boolean,
    interval = this.pollingInterval,
    pollingTimeout = this.timeout,
  ): Promise<T> {
    return startPollingUntilCondition<T>(
      cb,
      condition,
      interval,
      pollingTimeout,
    );
  }
}

export { HttpTransport };
