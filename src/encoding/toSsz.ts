import { hexToBytes, removeHexPrefix } from "../index.js";
import type { IMessage } from "../types/IMessage.js";
import type { ISignedMessage } from "../types/ISignedMessage.js";
import { SszMessageSchema, SszSignedMessageSchema } from "./ssz.js";

/**
 * Process a message before serializing it to SSZ.
 * @param message - Message object
 * @returns IMessage - Processed message object ready to be SSZ encoded.
 */
export const prepareMessage = <T extends IMessage>({
  from,
  to,
  data,
  ...rest
}: T) => ({
  ...rest,
  from: hexToBytes(removeHexPrefix(from)),
  to: hexToBytes(removeHexPrefix(to)),
  data: Array.from(data),
});

/**
 * Convert a message object to SSZ encoded Uint8Array.
 * @param message - Message object
 * @returns Uint8Array - SSZ encoded message
 */
const messageToSsz = (message: IMessage): Uint8Array => {
  const serialized = SszMessageSchema.serialize(prepareMessage(message));

  return serialized;
};

/**
 * Convert a signed message object to SSZ encoded Uint8Array.
 * @param message - Message object with signature
 * @returns Uint8Array - SSZ encoded signed message
 * @example
 * const serializedTx = signedMessageToSsz(signedMessage);
 */
const signedMessageToSsz = (message: ISignedMessage): Uint8Array => {
  const serialized = SszSignedMessageSchema.serialize(prepareMessage(message));

  return serialized;
};

export { messageToSsz, signedMessageToSsz };
