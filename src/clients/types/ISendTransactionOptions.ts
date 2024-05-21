/**
 * Options for sending a transaction.
 */
type ISendTransactionOptions = {
  /**
   * If true, the transaction will be validated before sending.
   * If the transaction is invalid, an error will be thrown.
   * If false, the transaction will not be validated before sending.
   * @default true
   */
  shouldValidate?: boolean;
};

export type { ISendTransactionOptions };
