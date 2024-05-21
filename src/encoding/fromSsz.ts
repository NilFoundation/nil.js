import {
  type IMessage,
  type ISignature,
  bytesToString,
  toHex,
} from "../index.js";
import type { ISignedMessage } from "../types/ISignedMessage.js";
import {
  SszMessageSchema,
  SszSignatureSchema,
  SszSignedMessageSchema,
} from "./ssz.js";

/**
 * Convert SSZ encoded message to a message object.
 * @param ssz - SSZ encoded message
 * @returns IMessage - Message object
 */
const sszToMessage = (ssz: Uint8Array): IMessage => {
  const { from, to, data, ...rest } = SszMessageSchema.deserialize(ssz);

  return {
    ...rest,
    from: bytesToString(from),
    to: bytesToString(to),
    data: bytesToString(data),
    signature: null,
  };
};

/**
 * Convert SSZ encoded signature to a signature object.
 * @param ssz - SSZ encoded signature
 * @returns ISignature - Signature object
 */
const sszToSignature = (ssz: Uint8Array): ISignature => {
  const { r, s, v, yParity } = SszSignatureSchema.deserialize(ssz);

  return {
    r: toHex(r),
    s: toHex(s),
    v: v ? v : undefined,
    yParity,
  };
};

/**
 * Convert SSZ encoded signed message to a signed message object.
 * @param ssz - SSZ encoded signed message
 * @returns ISignedMessage - Signed message object
 */
const sszToSignedMessage = (ssz: Uint8Array): ISignedMessage => {
  const { from, to, data, v, r, s, ...rest } =
    SszSignedMessageSchema.deserialize(ssz);

  return {
    ...rest,
    from: bytesToString(from),
    to: bytesToString(to),
    data: bytesToString(data),
    signature: null,
    v: v ? v : undefined,
    r: toHex(r),
    s: toHex(s),
  };
};

export { sszToMessage, sszToSignature, sszToSignedMessage };
