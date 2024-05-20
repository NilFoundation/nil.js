/**
 * The transaction type.
 * In fact, it implements ethereum transactions, but has some additional fields.
 */
interface ITransaction {
  /**
   *  The transaction type.
   */
  type?: null | number;
  /**
   * The recipient address.
   */
  to?: null | string;
  /**
   *  Sender address.
   */
  from?: null | string;
  /**
   *  The nonce.
   */
  nonce?: null | number;
  /**
   *  The gas limit.
   */
  gasLimit?: null | string | number | bigint;
  /**
   *  The gas price.
   */
  gasPrice?: null | string | number | bigint;
  /**
   *  The maximum priority fee per gas for london transactions.
   */
  maxPriorityFeePerGas?: null | string | number | bigint;
  /**
   *  The maximum total fee per gas for london transactions.
   */
  maxFeePerGas?: null | string | number | bigint;
  /**
   *  The data.
   */
  data?: null | string;
  /**
   *  The value (in wei) to send.
   */
  value?: null | string | number | bigint;
  /**
   *  The chain ID the transaction is valid on.
   */
  chainId?: null | string | number | bigint;
  /**
   *  The transaction hash.
   */
  hash?: null | string;
  /**
   *  The signature provided by the sender.
   */
  signature?: null | Uint8Array;
  /**
   *  The access list for berlin and london transactions.
   */
  accessList?: null | Array<{ address: string; storageKeys: Array<string> }>;
  /**
   * The transaction index.
   */
  maxFeePerBlobGas?: null | string | number | bigint;
  /**
   *
   */
  blobVersionedHashes?: null | Array<string>;
  /**
   * Shard ID.
   */
  shardId?: null | string;
}

export type { ITransaction };

// need to elaborate on this more
