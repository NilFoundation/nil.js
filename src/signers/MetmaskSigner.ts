import invariant from "tiny-invariant";
import type { ISignature } from "./types/ISignature.js";
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

  public sign(data: Uint8Array): ISignature {
    // mock signature
    return {
      signature: new Uint8Array(65),
    };
  }

  public getAddress(): string {
    // mock address
    return "0x";
  }

  public getPublicKey() {
    // mock public key
    return "0x";
  }

  public async connect(): Promise<void> {
    await this.provider.request({ method: "eth_requestAccounts" });
  }
}

export { MetaMaskSigner };
