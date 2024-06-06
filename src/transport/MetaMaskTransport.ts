import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import invariant from "tiny-invariant";
import { startPollingUntilCondition } from "../utils/polling.js";
import type { IHttpTransportConfig } from "./types/IHttpTransportConfig.js";
import type { ITransport } from "./types/ITransport.js";

class MetaMaskTransport implements ITransport {
  private provider;
  private timeout: number;
  private pollingInterval: number;

  constructor(config: IHttpTransportConfig) {
    this.timeout = config.timeout !== undefined ? config.timeout : 20000;
    this.pollingInterval = config.pollingInterval ?? 1000;

    invariant(
      typeof window !== "undefined",
      "MetaMaskSigner can be used in the browser only",
    );

    invariant(
      typeof window.ethereum !== "undefined",
      "No MetaMask provider found. Please install MetaMask browser extension before using MetaMaskSigner",
    );

    this.provider = window.ethereum;
  }

  public async request<T>(requestObject: RequestArguments): Promise<T> {
    return this.provider.request(requestObject);
  }

  public connect(): void {
    this.provider.request({ method: "eth_requestAccounts" });
  }

  public closeConnection(): void {
    //
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

export { MetaMaskTransport };
