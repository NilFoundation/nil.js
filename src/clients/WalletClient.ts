import { hexToBytes } from "@noble/curves/abstract/utils";
import invariant from "tiny-invariant";
import { prepareDeployData } from "../encoding/deployData.js";
import { poseidonHash } from "../encoding/poseidon.js";
import { messageToSsz, signedMessageToSsz } from "../encoding/toSsz.js";
import {
  type IReceipt,
  addHexPrefix,
  numberToBytes,
  removeHexPrefix,
  toHex,
} from "../index.js";
import type { ISigner } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import { assertIsValidMessage } from "../utils/assert.js";
import { PublicClient } from "./PublicClient.js";
import { emptyAddress } from "./constants.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { IDeployContractData } from "./types/IDeployContractData.js";
import type { ISendMessage } from "./types/ISendMessage.js";
import type { ISendMessageOptions } from "./types/ISendMessageOptions.js";
import type { ISignMessageOptions } from "./types/ISignMessageOptions.js";

import type { ValueOf } from "@chainsafe/ssz";
import { SszMessageSchema, SszSignedMessageSchema } from "../encoding/ssz.js";

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

  public async encodeMessage(message: ISendMessage): Promise<{
    bytes: Uint8Array;
    hash: Uint8Array;
  }> {
    const rawMsgFormat: ValueOf<typeof SszMessageSchema> = {
      internal: false,
      seqno:
        message.seqno ??
        (await this.getMessageCount(
          this.signer.getAddress(this.shardId),
          "latest",
        )),
      gasPrice: message.gasPrice ?? 0n,
      gasLimit: message.gasLimit ?? 0n,
      from: message.from
        ? hexToBytes(removeHexPrefix(message.from))
        : hexToBytes(this.signer.getAddress(this.shardId).slice(2)),
      to: message.to ? hexToBytes(message.to.slice(2)) : Uint8Array.from([]),
      value: message.value,
      data: message.data ?? Uint8Array.from([]),
    };
    console.log("raw msg", rawMsgFormat);
    const hash = SszMessageSchema.hashTreeRoot(rawMsgFormat);
    const signature = this.signer.sign(hash);

    const byteRepresenation = SszSignedMessageSchema.serialize({
      ...rawMsgFormat,
      signature: signature.signature,
    });
    return {
      bytes: byteRepresenation,
      hash: SszSignedMessageSchema.hashTreeRoot({
        ...rawMsgFormat,
        signature: signature.signature,
      }),
    };
  }

  /**
   * prepareMessage prepares a message to send.
   * @param message - The message to send.
   * @returns The prepared message.
   */
  public async prepareMessage(message: ISendMessage): Promise<IMessage> {
    const finalMsg = {
      ...message,
      from: message.from ? message.from : this.signer.getAddress(this.shardId),
      data: message.data ?? Uint8Array.from([]),
      internal: false,
    };

    const promises = [
      message.seqno ?? this.getMessageCount(finalMsg.from, "latest"),
      message.gasPrice ?? this.getGasPrice(),
      message.gasLimit ?? this.estimateGasLimit(),
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

    const signedMessage = await this.encodeMessage(preparedMsg);

    await this.sendRawMessage(addHexPrefix(toHex(signedMessage.bytes)));
    return signedMessage.hash;
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

    const poseidonNum = poseidonHash(serializedMessage);
    const hashBytes = numberToBytes(poseidonNum, 32);

    invariant(
      serializedMessage !== undefined,
      "Serialized message is required to sign a message.",
    );

    return signedMessageToSsz({
      ...message,
      ...this.signer.sign(hashBytes),
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
    deployData,
    ...restData
  }: IDeployContractData): Promise<Uint8Array> {
    const seqno =
      restData.seqno ??
      (await this.getMessageCount(
        this.signer.getAddress(this.shardId),
        "latest",
      ));

    const { hash, bytes } = await this.encodeMessage({
      data: prepareDeployData({
        seqno: deployData.seqno ?? seqno,
        shardId: deployData.shardId ?? this.shardId,
        bytecode: deployData.bytecode,
        pubkey: deployData.pubkey,
      }),
      value: 0n,
      to: emptyAddress,
      from: restData.from ?? this.signer.getAddress(this.shardId),
      gasPrice: restData.gasPrice ?? (await this.getGasPrice()),
      gasLimit: restData.gasLimit ?? 100_000n,
      seqno,
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
