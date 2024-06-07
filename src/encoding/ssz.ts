import {
  hashObjectToUint8Array,
  setHasher,
  uint8ArrayToHashObject,
} from "@chainsafe/persistent-merkle-tree";
import {
  BooleanType,
  ByteListType,
  ByteVectorType,
  ContainerType,
  UintBigintType,
  UintNumberType,
} from "@chainsafe/ssz";
import { concatBytes } from "@noble/curves/abstract/utils";
import { poseidonHash } from "./poseidon.js";

// TODO: delete when it will be fixed on backend
export const initZeroHashes = () => {
  const testType = new ContainerType({
    list: new ByteListType(2 ** 32 - 1),
  });

  testType.hashTreeRoot({
    list: Uint8Array.from([]),
  });

  setHasher({
    digest64(a, b) {
      // console.log("digest a b", a, b);
      const hash = poseidonHash(concatBytes(a, b));
      const arr = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        // Shift the BigInt to the right by 8 * i bits, then take the 8 least significant bits
        arr[31 - i] = Number((hash >> BigInt(i * 8)) & BigInt(0xff));
      }
      return arr;
    },
    digest64HashObjects(a, b) {
      const hash = poseidonHash(
        concatBytes(hashObjectToUint8Array(a), hashObjectToUint8Array(b)),
      );
      const arr = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        // Shift the BigInt to the right by 8 * i bits, then take the 8 least significant bits
        arr[31 - i] = Number((hash >> BigInt(i * 8)) & BigInt(0xff));
      }
      return uint8ArrayToHashObject(arr);
    },
  });
};

initZeroHashes();

const basicTypes = {
  Uint8: new UintNumberType(1),
  Uint32: new UintNumberType(4),
  Uint64: new UintNumberType(8),
  UintBn256: new UintBigintType(32),
  Bool: new BooleanType(),
};

const Bytes20 = new ByteVectorType(20);
const Bytes33 = new ByteVectorType(33);
const Bytes65 = new ByteVectorType(65);

/**
 * SSZ schema for a message object. It includes all the fields of a message object.
 */
export const SszMessageSchema = new ContainerType({
  internal: basicTypes.Bool,
  seqno: basicTypes.Uint64,
  gasPrice: basicTypes.UintBn256,
  gasLimit: basicTypes.UintBn256,
  from: Bytes20,
  to: Bytes20,
  value: basicTypes.UintBn256,
  data: new ByteListType(24576),
});

/**
 * SSZ schema for a signed message object. It includes all the fields of a signed message object.
 */
export const SszSignedMessageSchema = new ContainerType({
  ...SszMessageSchema.fields,
  signature: Bytes65,
});

export const SszDeployMessageSchema = new ContainerType({
  shardId: basicTypes.Uint32,
  seqno: basicTypes.Uint64,
  publicKey: Bytes33,
  code: new ByteListType(24576),
});
