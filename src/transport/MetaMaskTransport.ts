import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";
import invariant from "tiny-invariant";
import type { IHttpTransportConfig } from "./types/IHttpTransportConfig.js";
import type { ITransport } from "./types/ITransport.js";

class MetaMaskTransport implements ITransport {
  private provider;
  private timeout: number;

  constructor(config: IHttpTransportConfig) {
    this.timeout = config.timeout !== undefined ? config.timeout : 20000;

    invariant(
      typeof window !== "undefined",
      "MetaMaskTransport can be used in the browser only",
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
}

export { MetaMaskTransport };
