import {
  ByteVectorType,
  ContainerType,
  ListBasicType,
  UintBigintType,
  UintNumberType,
} from "@chainsafe/ssz";

const basicTypes = {
  Uint8: new UintNumberType(1),
  Uint64: new UintNumberType(8),
  UintBn256: new UintBigintType(32),
};

const Bytes20 = new ByteVectorType(20);

/**
 * SSZ schema for a message object. It includes all the fields of a message object.
 */
const SszMessageSchema = new ContainerType({
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
  r: basicTypes.UintBn256,
  s: basicTypes.UintBn256,
  v: basicTypes.Uint8,
});

/**
 * SSZ schema for a signed message object. It includes all the fields of a signed message object.
 */
const SszSignedMessageSchema = new ContainerType({
  ...SszMessageSchema.fields,
  ...SszSignatureSchema.fields,
});

export { SszMessageSchema, SszSignedMessageSchema };
