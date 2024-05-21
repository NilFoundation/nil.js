import {
  ByteVectorType,
  ContainerType,
  OptionalType,
  UintBigintType,
  UintNumberType,
} from "@chainsafe/ssz";

const Bytes32 = new ByteVectorType(32);
const Bytes96 = new ByteVectorType(96);
const Uint32 = new UintNumberType(4);
const UintBn64 = new UintBigintType(8);

/**
 * SSZ schema for a transaction object. It includes all the fields of a transaction object.
 */
const SszTransactionSchema = new ContainerType({
  index: Uint32,
  shardId: Uint32,
  from: Bytes32,
  to: Bytes32,
  value: UintBn64,
  data: Bytes96,
  seqno: Uint32,
  signature: new OptionalType(Bytes96),
  maxPriorityFeePerGas: UintBn64,
  gasPrice: UintBn64,
  maxFeePerGas: UintBn64,
  chainId: Uint32,
});

/**
 * SSZ schema for a signature object. It includes all the fields of a signature object.
 */
const SszSignatureSchema = new ContainerType({
  r: Bytes32,
  s: Bytes32,
  v: new OptionalType(UintBn64),
  yParity: UintBn64,
});

/**
 * SSZ schema for a signed transaction object. It includes all the fields of a signed transaction object.
 */
const SszSignedTransactionSchema = new ContainerType({
  ...SszTransactionSchema.fields,
  ...SszSignatureSchema.fields,
});

export { SszTransactionSchema, SszSignedTransactionSchema };
