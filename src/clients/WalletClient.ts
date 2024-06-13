import { hexToBytes } from "@noble/curves/abstract/utils";
import invariant from "tiny-invariant";
import { prepareDeployData } from "../encoding/deployData.js";
import { SszMessageSchema, SszSignedMessageSchema } from "../encoding/ssz.js";
import { toHex } from "../encoding/toHex.js";
import type { ISigner } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import type { IReceipt } from "../types/IReceipt.js";
import {
  assertIsValidDeployData,
  assertIsValidSendMessageData,
} from "../utils/assert.js";
import { addHexPrefix, removeHexPrefix } from "../utils/hex.js";
import { PublicClient } from "./PublicClient.js";
import { emptyAddress } from "./constants.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { IDeployContractData } from "./types/IDeployContractData.js";
import type { IDeployContractOptions } from "./types/IDeployContractOptions.js";
import type { ISendMessage } from "./types/ISendMessage.js";
import type { ISendMessageOptions } from "./types/ISendMessageOptions.js";

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
  constructor(config: IWalletClientConfig) {
    super(config);
    this.signer = config.signer;
  }

  public async encodeMessage(rawMsgFormat: IMessage): Promise<{
    bytes: Uint8Array;
    hash: Uint8Array;
  }> {
    const hashMessageUnsigned = SszMessageSchema.hashTreeRoot(rawMsgFormat);

    const { signature } = this.signer.sign(hashMessageUnsigned);

    const bytes = SszSignedMessageSchema.serialize({
      ...rawMsgFormat,
      signature,
    });

    const hash = SszSignedMessageSchema.hashTreeRoot({
      ...rawMsgFormat,
      signature,
    });

    return { bytes, hash };
  }

  /**
   * populateMessage prepares a message to send.
   * @param message - The message to send.
   * @returns The prepared message.
   */
  public async populateMessage({
    to,
    from,
    data,
    seqno: userSeqno,
    gasPrice: userGasPrice,
    gasLimit: userGasLimit,
    ...restMessage
  }: ISendMessage): Promise<IMessage> {
    const finalMsg = {
      ...restMessage,
      to: to ? hexToBytes(removeHexPrefix(to)) : Uint8Array.from([]),
      from: from
        ? hexToBytes(removeHexPrefix(from))
        : hexToBytes(removeHexPrefix(this.signer.getAddress(this.shardId))),
      data: data ?? Uint8Array.from([]),
      internal: false,
    };

    const promises = [
      userSeqno ??
        this.getMessageCount(this.signer.getAddress(this.shardId), "latest"),
      userGasPrice ?? this.getGasPrice(),
      userGasLimit ?? this.estimateGasLimit(),
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
    shouldValidate && assertIsValidSendMessageData(message);

    const preparedMsg = await this.populateMessage(message);

    const signedMessage = await this.encodeMessage(preparedMsg);

    await this.sendRawMessage(addHexPrefix(toHex(signedMessage.bytes)));

    return signedMessage.hash;
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
    {
      deployData: { shardId, pubkey, bytecode, seqno },
      ...restData
    }: IDeployContractData,
    { shouldValidate = true }: IDeployContractOptions = {},
  ): Promise<Uint8Array> {
    const populatedMesageData = {
      value: 0n,
      to: emptyAddress,
      ...restData,
    };

    if (shouldValidate) {
      assertIsValidSendMessageData(populatedMesageData);
    }

    const { data, ...populatedMessage } =
      await this.populateMessage(populatedMesageData);

    const populatedDeployData = {
      shardId: shardId ?? this.shardId,
      pubkey,
      bytecode,
      seqno: seqno ?? populatedMessage.seqno,
    };

    if (shouldValidate) {
      assertIsValidDeployData(populatedDeployData);
    }

    const { hash, bytes } = await this.encodeMessage({
      data: prepareDeployData(populatedDeployData),
      ...populatedMessage,
    });

    await this.sendRawMessage(addHexPrefix(toHex(bytes)));

    // in the future we want to use subscribe method to get the receipt
    // for now it is simple short polling
    const receipt = await this.transport.startPollingUntil<IReceipt>(
      () => this.getMessageReceiptByHash(hash),
      (receipt) => Boolean(receipt),
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
