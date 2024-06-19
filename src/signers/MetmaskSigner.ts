import invariant from "tiny-invariant";
import type { ISigner } from "./types/ISigner.js";

/**
 * MetaMaskSigner is a class that allows you to sign data using MetaMask.
 * It is an abstraction of signing data using MetaMask.
 * Can be used in the browser only.
 * @example
 * import { MetaMaskSigner } from '@nilfoundation/niljs';
 *
 * const signer = new MetaMaskSigner();
 */
class MetaMaskSigner implements ISigner {
  private provider;
  constructor() {
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

  public async sign(data: Uint8Array) {
    // mock signature
    return new Uint8Array(65);
  }

  public async getAddress() {
    // mock address
    return new Uint8Array(20);
  }

  public async getPublicKey() {
    // mock public key
    return new Uint8Array(33);
  }

  public async connect(): Promise<void> {
    await this.provider.request({ method: "eth_requestAccounts" });
  }
}

export { MetaMaskSigner };
