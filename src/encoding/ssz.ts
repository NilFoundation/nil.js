import {
  BooleanType,
  ByteVectorType,
  ContainerType,
  ListBasicType,
  UintBigintType,
  UintNumberType,
} from "@chainsafe/ssz";
import type {} from "../index.js";

const basicTypes = {
  Uint8: new UintNumberType(1),
  Uint64: new UintNumberType(8),
  UintBn256: new UintBigintType(32),
  Bool: new BooleanType(),
};

const Bytes20 = new ByteVectorType(20);
const Bytes65 = new ByteVectorType(65);

/**
 * SSZ schema for a message object. It includes all the fields of a message object.
 */
const SszMessageSchema = new ContainerType({
  internal: basicTypes.Bool,
  seqno: basicTypes.Uint64,
  gasPrice: basicTypes.UintBn256,
  gasLimit: basicTypes.UintBn256,
  from: Bytes20,
  to: Bytes20,
  value: basicTypes.UintBn256,
  data: new ListBasicType(basicTypes.Uint8, 24576),
});

/**
 * SSZ schema for a signature object. It includes all the fields of a signature object.
 */
const SszSignatureSchema = new ContainerType({
  signature: Bytes65,
});

/**
 * SSZ schema for a signed message object. It includes all the fields of a signed message object.
 */
const SszSignedMessageSchema = new ContainerType({
  ...SszMessageSchema.fields,
  ...SszSignatureSchema.fields,
});

export { SszMessageSchema, SszSignedMessageSchema };
