import type { Client as RPCClient } from "@open-rpc/client-js";
import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import { createRPCClient } from "../rpc/rpcClient.js";
import type { IHttpTransportConfig } from "./types/IHttpTransportConfig.js";
import type { ITransport } from "./types/ITransport.js";

class HttpTransport implements ITransport {
  private rpcClient: RPCClient;
  private timeout: number;

  constructor(config: IHttpTransportConfig) {
    this.rpcClient = createRPCClient(config.endpoint);
    this.timeout = config.timeout !== undefined ? config.timeout : 20000;
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
}

export { HttpTransport };
