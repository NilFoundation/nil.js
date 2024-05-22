import invariant from "tiny-invariant";
import { messageToSsz, signedMessageToSsz } from "../encoding/toSsz.js";
import type { ISigner } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import type { IReceipt } from "../types/IReceipt.js";
import { assertIsValidMessage } from "../utils/assert.js";
import { BaseClient } from "./BaseClient.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { ISendMessageOptions } from "./types/ISendMessageOptions.js";
import type { ISignMessageOptions } from "./types/ISignMessageOptions.js";

/**
 * Wallet client is a class that allows you to interact with the network via JSON-RPC api.
 * It is an abstraction of connection to the Nil network.
 * Wallet client alllows to use api that require signing data and private key usage.
 * @example
 * import { WalletClient } from 'niljs';
 *
 * const client = new WalletClient({
 *  endpoint: 'http://127.0.0.1:8529'
 * })
 */
class WalletClient extends BaseClient {
  private signer?: ISigner;

  constructor(config: IWalletClientConfig) {
    super(config);
    this.signer = config.signer;
  }

  /**
   * sendMessage sends a message to the network.
   * @param message - The message to send. It will be signed with the signer.
   * @param options - The options to send a message.
   * @returns The hash of the message.
   * @example
   * import { WalletClient } from 'niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.sendMessage(message);
   */
  public async sendMessage(
    message: IMessage,
    { shouldValidate = true } = {} as ISendMessageOptions,
  ): Promise<Uint8Array> {
    shouldValidate && assertIsValidMessage(message);

    const signedMessage = this.signMessage(message, {
      shouldValidate: false,
    });

    return await this.sendRawMessage(signedMessage);
  }

  /**
   * signMessage signs a message with the signer.
   * @param message - The message to sign.
   * @param options - The options to sign a message.
   * @returns The signed message as Uint8Array.
   */
  public signMessage(
    message: IMessage,
    { shouldValidate = true } = {} as ISignMessageOptions,
  ): Uint8Array {
    shouldValidate && assertIsValidMessage(message);

    invariant(
      this.signer !== undefined,
      "Signer is required to sign a message. Please provide a signer in the constructor or use sendRawMessage method.",
    );

    const serializedMessage = messageToSsz(message);

    invariant(
      serializedMessage !== undefined,
      "Serialized message is required to sign a message.",
    );

    const signature = this.signer.sign(serializedMessage);

    return signedMessageToSsz({
      ...message,
      ...signature,
    });
  }

  /**
   * sendRawMessage sends a raw message to the network.
   * @param message - The message to send.
   * @returns The hash of the message.
   * @example
   * import { WalletClient } from 'niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const message = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.sendRawMessage(message);
   */
  public async sendRawMessage(message: Uint8Array): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_sendRawMessage",
      params: [message],
    });

    return res.hash;
  }

  /**
   * deployContract deploys a contract to the network.
   * @param contract - The contract to deploy.
   * @returns The hash of the message.
   * @example
   import { WalletClient } from 'niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const contract = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.deployContract(contract);
   */
  public async deployContract(contract: Uint8Array): Promise<Uint8Array> {
    const hash = await this.sendRawMessage(contract);
    // there will be a method to get receipt by hash, but it is not implemented yet
    // it will use kinda polling to get receipt asap
    // mocking it for now:
    const receipt: Partial<IReceipt> = {
      success: true,
    };

    // ! compiling smart contract to the bytecode shall not be included in this library
    // it can be done by hardhat
    invariant(
      receipt.success,
      "Contract deployment failed. Please check the contract bytecode.",
    );

    return hash;
  }
}

export { WalletClient };
