import type { Hex } from "@noble/curves/abstract/utils";
import invariant from "tiny-invariant";
import type { IPrivateKey } from "../types/IPrivateKey.js";
import type { ITransaction } from "../types/ITransaction.js";
import { isHexString } from "./hex.js";
import { isAddress } from "./transaction.js";

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
    isHexString(privateKey) && privateKey.length === 64 + 2,
    message ?? `Expected a valid private key, but got ${privateKey}`,
  );
};

/**
 * Checks if the value is a valid transaction. If the value is a valid transaction, it returns nothing.
 * @throws Will throw an error if the value is not a valid transaction.
 * @param transaction - The transaction to validate.
 */
const assertIsValidTransaction = (transaction: ITransaction) => {
  const {
    chainId,
    maxPriorityFeePerGas,
    gasPrice,
    maxFeePerGas,
    to,
    accessList,
  } = transaction;
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
  invariant(
    Array.isArray(accessList),
    `Expected a valid 'accessList' but got ${accessList}`,
  );
};

export {
  assertIsBuffer,
  assertIsHexString,
  assertIsValidPrivateKey,
  assertIsValidTransaction,
};
