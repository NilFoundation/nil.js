import invariant from "tiny-invariant";
import { prepareDeployData } from "../encoding/deployData.js";
import { messageToSsz, signedMessageToSsz } from "../encoding/toSsz.js";
import {
  type IReceipt,
  addHexPrefix,
  getShardIdFromAddress,
  toHex,
} from "../index.js";
import type { ISigner } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import { assertIsValidMessage } from "../utils/assert.js";
import { startPollingUntilCondition } from "../utils/polling.js";
import { PublicClient } from "./PublicClient.js";
import { emptyAddress } from "./constants.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { IDeployContractData } from "./types/IDeployContractData.js";
import type { IDeployContractOptions } from "./types/IDeployContractOptions.js";
import type { ISendMessage } from "./types/ISendMessage.js";
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
    // TODO - get shardId from address and remove default value
    this.shardId = 0 ?? getShardIdFromAddress(address);
  }

  /**
   * prepareMessage prepares a message to send.
   * @param message - The message to send.
   * @returns The prepared message.
   */
  public async prepareMessage(message: ISendMessage): Promise<IMessage> {
    const finalMsg = {
      ...message,
      from: message.from ? message.from : this.signer.getAddress(),
      data: message.data ?? Uint8Array.from([]),
    };

    const promises = [
      message.seqno ??
        this.getMessageCount(this.shardId, finalMsg.from, "latest"),
      message.gasPrice ?? this.getGasPrice(this.shardId),
      message.gasLimit ?? this.estimateGasLimit(this.shardId),
    ] as const;

    const [seqno, gasPrice, gasLimit] = await Promise.all(promises);

    return {
      ...finalMsg,
      seqno,
      gasPrice,
      gasLimit,
    };
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
    message: ISendMessage,
    { shouldValidate = true } = {} as ISendMessageOptions,
  ): Promise<Uint8Array> {
    const preparedMsg = await this.prepareMessage(message);
    shouldValidate && assertIsValidMessage(preparedMsg);

    const signedMessage = this.signMessage(preparedMsg, {
      shouldValidate: false,
    });

    return await this.sendRawMessage(addHexPrefix(toHex(signedMessage)));
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

    return signedMessageToSsz({
      ...message,
      ...this.signer.sign(serializedMessage),
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
  public async deployContract(
    { deployData, ...restData }: IDeployContractData,
    { shouldValidate = true }: IDeployContractOptions = {},
  ): Promise<Uint8Array> {
    const hash = await this.sendMessage(
      {
        data: prepareDeployData(deployData),
        value: 0n,
        to: emptyAddress,
        ...restData,
      },
      { shouldValidate },
    );

    // in the future we want to use subscribe method to get the receipt
    // for now it is simple short polling
    const receipt = await startPollingUntilCondition<IReceipt>(
      () => this.getMessageReceiptByHash(this.shardId, hash),
      (receipt) => Boolean(receipt),
      1000,
    );

    // here it is now always false but we need a fix from the node (add money)
    invariant(
      receipt?.success,
      `Contract deployment failed. Receipt: ${JSON.stringify(receipt)}`,
    );

    return hash;
  }
}

export { WalletClient };
