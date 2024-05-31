import { type IMessage, addHexPrefix, toHex } from "../index.js";
import type { ISignedMessage } from "../types/ISignedMessage.js";
import { SszMessageSchema, SszSignedMessageSchema } from "./ssz.js";

/**
 * Convert SSZ encoded message to a message object.
 * @param ssz - SSZ encoded message
 * @returns IMessage - Message object
 */
const sszToMessage = (ssz: Uint8Array): IMessage => {
  const { from, to, data, ...rest } = SszMessageSchema.deserialize(ssz);

  return {
    ...rest,
    from: addHexPrefix(toHex(from)),
    to: addHexPrefix(toHex(to)),
    data: new Uint8Array(data),
  };
};

/**
 * Convert SSZ encoded signed message to a signed message object.
 * @param ssz - SSZ encoded signed message
 * @returns ISignedMessage - Signed message object
 */
const sszToSignedMessage = (ssz: Uint8Array): ISignedMessage => {
  const { from, to, data, ...rest } = SszSignedMessageSchema.deserialize(ssz);

  return {
    ...rest,
    from: addHexPrefix(toHex(from)),
    to: addHexPrefix(toHex(to)),
    data: new Uint8Array(data),
  };
};

export { sszToMessage, sszToSignedMessage };
