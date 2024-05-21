import {} from "@chainsafe/ssz";
import type { ISignedTransaction } from "../types/ISignedTransaction.js";
import type { ITransaction } from "../types/ITransaction.js";
import { hexToBytes } from "./fromHex.js";
import {
  SszSignedTransactionSchema,
  SszTransactionSchema,
} from "./sszSchemas.js";
import { toBytes } from "./toBytes.js";

/**
 * Process a transaction object to convert all string fields to bytes and BigInt fields to BigInt.
 * @param transaction - Transaction object
 * @returns ITransaction - Processed transaction object ready to be SSZ encoded.
 */
const processTransaction = ({
  from,
  to,
  value,
  data,
  signature,
  maxPriorityFeePerGas,
  gasPrice,
  maxFeePerGas,
  ...rest
}: ITransaction) => ({
  ...rest,
  from: toBytes(from),
  to: toBytes(to),
  value: BigInt(value),
  data: toBytes(data),
  signature: signature ? toBytes(signature) : null,
  maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
  gasPrice: BigInt(gasPrice),
  maxFeePerGas: BigInt(maxFeePerGas),
});

/**
 * Process a signed transaction object to convert all string fields to bytes and BigInt fields to BigInt.
 * @param signedTransaction - Signed transaction object
 * @returns ISignedTransaction - Processed signed transaction object ready to be SSZ encoded.
 */
const processSignedTransaction = ({
  v,
  r,
  s,
  yParity,
  ...rest
}: ISignedTransaction) => ({
  ...rest,
  v: v ? BigInt(v) : null,
  r: hexToBytes(r),
  s: hexToBytes(s),
  yParity: BigInt(yParity),
  ...processTransaction(rest),
});

/**
 * Convert a transaction object to SSZ encoded Uint8Array.
 * @param transaction - Transaction object
 * @returns Uint8Array - SSZ encoded transaction
 */
const transactionToSsz = (transaction: ITransaction): Uint8Array => {
  const serialized = SszTransactionSchema.serialize(
    processTransaction(transaction),
  );

  return serialized;
};

/**
 * Convert a signed transaction object to SSZ encoded Uint8Array.
 * @param transaction - Transaction object with signature
 * @returns Uint8Array - SSZ encoded signed transaction
 * @example
 * const serializedTx = signedTransactionToSsz(signedTransaction);
 */
const signedTransactionToSsz = (
  transaction: ISignedTransaction,
): Uint8Array => {
  const serialized = SszSignedTransactionSchema.serialize(
    processSignedTransaction(transaction),
  );
  return serialized;
};

export { transactionToSsz, signedTransactionToSsz };
