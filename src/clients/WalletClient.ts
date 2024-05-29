import invariant from "tiny-invariant";
import { messageToSsz, signedMessageToSsz } from "../encoding/toSsz.js";
import { type IReceipt, getShardIdFromAddress, toHex } from "../index.js";
import type { ISigner } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import { assertIsValidMessage } from "../utils/assert.js";
import { startPollingUntilCondition } from "../utils/polling.js";
import { PublicClient } from "./PublicClient.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { IDeployContractOption } from "./types/IDeployContractOption.js";
import type { ISendMessageOptions } from "./types/ISendMessageOptions.js";
import type { ISignMessageOptions } from "./types/ISignMessageOptions.js";

/**
 * Wallet client is a class that allows you to interact with the network via JSON-RPC api.
 * It is an abstraction of connection to the Nil network.
 * Wallet client alllows to use api that require signing data and private key usage.
 * @example
 * import { WalletClient } from '@nilfoundation/niljs';
 * import { LocalKeySigner } from '@nilfoundation/niljs';
 *
 * const client = new WalletClient({
 *  endpoint: 'http://127.0.0.1:8529'
 *  signer: new LocalKeySigner({ privateKey: "xxx" })
 * })
 */
class WalletClient extends PublicClient {
  private signer: ISigner;
  private shardId: number;

  constructor(config: IWalletClientConfig) {
    super(config);
    this.signer = config.signer;

    const address = this.signer.getAddress();
    this.shardId = getShardIdFromAddress(address);
  }

  /**
   * prepareMessage prepares a message to send.
   * @param message - The message to send.
   * @returns The prepared message.
   */
  private async prepareMessage(message: IMessage): Promise<IMessage> {
    const { gasPrice } = message;
    const finalMsg = {
      ...message,
      from: message.from ? message.from : this.signer.getAddress(),
    };

    if (!gasPrice) {
      const gasPrice = await this.getGasPrice(this.shardId);
      finalMsg.gasPrice = gasPrice;
    }

    return finalMsg;
  }

  /**
   * sendMessage sends a message to the network.
   * "from" field in the message is automatically filled with the signer address, but
   * can be overwritten by providing the "from" field in the message.
   * @param message - The message to send. It will be signed with the signer.
   * @param options - The options to send a message.
   * @returns The hash of the message.
   * @example
   * import { WalletClient } from '@nilfoundation/niljs';
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
    const preparedMsg = await this.prepareMessage(message);
    shouldValidate && assertIsValidMessage(preparedMsg);

    const signedMessage = this.signMessage(preparedMsg, {
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
   * deployContract deploys a contract to the network.
   * @param contract - The contract to deploy.
   * @returns The hash of the message.
   * @example
   import { WalletClient } from '@nilfoundation/niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const contract = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.deployContract(contract);
   */
  public async deployContract({
    bytecode,
    ...rest
  }: IDeployContractOption): Promise<Uint8Array> {
    const hash = await this.sendMessage({
      data: toHex(bytecode),
      ...rest,
    } as IMessage);

    // in the future we want to use subscribe method to get the receipt
    // for now it is simple short polling
    const receipt = await startPollingUntilCondition<IReceipt>(
      async () => await this.getMessageReceiptByHash(this.shardId, hash),
      (receipt) => receipt !== undefined,
      1000,
    );

    // ! compiling smart contract to the bytecode shall not be included in this library
    // it can be done by hardhat
    invariant(receipt?.success, "Contract deployment failed.");

    return hash;
  }
}

export { WalletClient };
