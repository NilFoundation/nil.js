import invariant from "tiny-invariant";
import { signedTransactionToSsz, transactionToSsz } from "../encoding/toSsz.js";
import type { ISigner } from "../signers/index.js";
import type { ITransaction } from "../types/ITransaction.js";
import { assertIsValidTransaction } from "../utils/assert.js";
import { BaseClient } from "./BaseClient.js";
import type { IWalletClientConfig } from "./types/ClientConfigs.js";
import type { ISendTransactionOptions } from "./types/ISendTransactionOptions.js";

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
   * sendTransaction sends a transaction to the network.
   * @param transaction - The transaction to send. It can be a raw transaction or a base transaction object.
   * If the transaction is a raw transaction, it will be signed with the signer, that is passed in the constructor.
   * @returns The hash of the transaction.
   * @example
   * import { WalletClient } from 'niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const transaction = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.sendTransaction(transaction);
   */
  public async sendTransaction(
    transaction: ITransaction,
    { shouldValidate = true } = {} as ISendTransactionOptions,
  ): Promise<Uint8Array> {
    shouldValidate && assertIsValidTransaction(transaction);

    invariant(
      this.signer !== undefined,
      "Signer is required to sign a transaction. Please provide a signer in the constructor or use sendRawTransaction method.",
    );

    const serializedTransaction = transactionToSsz(transaction);

    invariant(
      serializedTransaction !== undefined,
      "Serialized transaction is required to sign a transaction.",
    );

    const signature = this.signer.sign(serializedTransaction);

    const signedTransaction = signedTransactionToSsz({
      ...transaction,
      ...signature,
    });

    return await this.sendRawTransaction(signedTransaction);
  }

  /**
   * sendRawTransaction sends a raw transaction to the network.
   * @param transaction - The transaction to send.
   * @returns The hash of the transaction.
   * @example
   * import { WalletClient } from 'niljs';
   *
   * const client = new WalletClient({
   *  endpoint: 'http://127.0.0.1:8529'
   * })
   *
   * const transaction = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const hash = await client.sendRawTransaction(transaction);
   */
  public async sendRawTransaction(
    transaction: Uint8Array,
  ): Promise<Uint8Array> {
    const res = await this.rpcClient.request({
      method: "eth_sendRawTransaction",
      params: [transaction],
    });

    return res.hash;
  }

  /**
   * deployContract deploys a contract to the network.
   * @param contract - The contract to deploy.
   * @returns The hash of the transaction.
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
    const hash = await this.sendRawTransaction(contract);
    // there will be a method to get receipt by hash
    // receipt - result of smart conract calling
    // we should wait to receipts to be sure that transaction is included in the block
    return hash;
  }
}

export { WalletClient };
