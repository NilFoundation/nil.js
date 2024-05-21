/**
 * Options for signing a message.
 */
type ISignMessageOptions = {
  /**
   * If true, the message will be validated before signing.
   * If the message is invalid, an error will be thrown.
   * If false, the message will not be validated before sending.
   * @default true
   */
  shouldValidate?: boolean;
};

export type { ISignMessageOptions };
