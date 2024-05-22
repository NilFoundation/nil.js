import type { Hex } from "@noble/curves/abstract/utils";
import invariant from "tiny-invariant";
import type { IPrivateKey } from "../signers/index.js";
import type { IMessage } from "../types/IMessage.js";
import { isHexString } from "./hex.js";
import { isAddress } from "./message.js";

/**
 * Checks if the value is a string.
 * @throws Will throw an error if the value is not a hex string.
 * @param value - The value to check.
 * @param message - The message to throw if the value is not a hex string.
 */
const assertIsHexString = (value: Hex, message?: string): void => {
  invariant(
    isHexString(value),
    message ?? `Expected a hex string but got ${value}`,
  );
};

/**
 * Checks if the value is a buffer.
 * @throws Will throw an error if value is not a buffer.
 * @param value - The value to check.
 * @param message - The message to throw if the value is not a buffer.
 */
const assertIsBuffer = (value: Uint8Array, message?: string): void => {
  invariant(
    value instanceof Uint8Array,
    message ?? `Expected a buffer but got ${value}`,
  );
};

/**
 * Checks if provided private key is valid. If the value is a hex string with length 32 nothing is returned.
 * @throws Will throw an error if provided private key is invalid.
 * @param privateKey - The private key to check.
 * @param message - The message to throw if the private key is invalid.
 */
const assertIsValidPrivateKey = (
  privateKey: IPrivateKey,
  message?: string,
): void => {
  invariant(
    isHexString(privateKey) && privateKey.length === 64,
    message ?? `Expected a valid private key, but got ${privateKey}`,
  );
};

/**
 * Checks if the value is a valid message. If the value is a valid message, it returns nothing.
 * @throws Will throw an error if the value is not a valid message.
 * @param message - The message to validate.
 */
const assertIsValidMessage = (message: IMessage) => {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = message;
  invariant(
    typeof to === "string" && isAddress(to),
    `Expected a valid 'to' address but got ${to}`,
  );
  invariant(
    typeof chainId === "number" && chainId > 0,
    `Expected a valid 'chainId' but got ${chainId}`,
  );
  invariant(
    typeof gasPrice === "number" && gasPrice > 0,
    `Expected a valid 'gasPrice' but got ${gasPrice}`,
  );
  invariant(
    typeof maxFeePerGas === "number" && maxFeePerGas > 0,
    `Expected a valid 'maxFeePerGas' but got ${maxFeePerGas}`,
  );
  invariant(
    typeof maxPriorityFeePerGas === "number" && maxPriorityFeePerGas > 0,
    `Expected a valid 'maxPriorityFeePerGas' but got ${maxPriorityFeePerGas}`,
  );
};

/**
 * Checks if the address is valid. If the address is valid, it returns nothing.
 * @param address - The address to check.
 * @param message - The message to throw if the address is invalid.
 */
const assertIsAddress = (address: string, message?: string): void => {
  invariant(
    isAddress(address),
    message ?? `Expected a valid address but got ${address}`,
  );
};

export {
  assertIsBuffer,
  assertIsHexString,
  assertIsValidPrivateKey,
  assertIsValidMessage,
  assertIsAddress,
};
