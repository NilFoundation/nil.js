import {} from "@chainsafe/ssz";
import type { ISignature } from "../index.js";
import type { IMessage } from "../types/IMessage.js";
import type { ISignedMessage } from "../types/ISignedMessage.js";
import {
  SszMessageSchema,
  SszSignatureSchema,
  SszSignedMessageSchema,
} from "./ssz.js";
import { toBytes } from "./toBytes.js";

/**
 * Process a message object to convert all string fields to bytes and BigInt fields to BigInt.
 * @param message - Message object
 * @returns IMessage - Processed message object ready to be SSZ encoded.
 */
const prepareMessage = ({ from, to, data, signature, ...rest }: IMessage) => ({
  ...rest,
  from: toBytes(from),
  to: toBytes(to),
  data: toBytes(data),
  signature: signature ? toBytes(signature) : null,
});

/**
 * Process a signature object to convert all string fields to bytes and BigInt fields to BigInt.
 * @param signature - Signature object
 * @returns ISignature - Processed signature object ready to be SSZ encoded.
 */
const prepareSignature = ({ r, s, v, yParity }: ISignature) => ({
  r: toBytes(r),
  s: toBytes(s),
  v: v ? v : null,
  yParity,
});

/**
 * Process a signed message object to convert all string fields to bytes and BigInt fields to BigInt.
 * @param signedMessage - Signed message object
 * @returns ISignedMessage - Processed signed message object ready to be SSZ encoded.
 */
const processSignedMessage = ({
  v,
  r,
  s,
  yParity,
  ...rest
}: ISignedMessage) => ({
  ...prepareMessage(rest),
  ...prepareSignature({ r, s, v, yParity }),
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
 * Convert a signature object to SSZ encoded Uint8Array.
 * @param signature - Signature object
 * @returns Uint8Array - SSZ encoded signature
 */
const signatureToSsz = (signature: ISignature): Uint8Array => {
  const serialized = SszSignatureSchema.serialize(prepareSignature(signature));

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
  const serialized = SszSignedMessageSchema.serialize(
    processSignedMessage(message),
  );
  return serialized;
};

export { messageToSsz, signedMessageToSsz, signatureToSsz };
