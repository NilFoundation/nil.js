import { hexToBytes } from "@noble/curves/abstract/utils";
import type { IDeployData } from "../clients/types/IDeployData.js";
import { removeHexPrefix } from "../utils/hex.js";
import { SszDeployMessageSchema } from "./ssz.js";

/**
 * Prepare deploy data.
 * @param d - Deploy data
 * @returns Deploy data as bytes
 */
const prepareDeployData = (d: IDeployData): Uint8Array => {
  let pubkey: Uint8Array;
  if (d.pubkey) {
    if (typeof d.pubkey === "string") {
      pubkey = hexToBytes(removeHexPrefix(d.pubkey));
    } else {
      pubkey = d.pubkey;
    }
  } else {
    const arr = new Uint8Array(33);
    for (let i = 0; i < 33; i++) {
      arr[i] = 0;
    }
    pubkey = arr;
  }
  if (pubkey.length !== 33) {
    throw new Error("Public key must be 33 bytes long");
  }

  let bytecode: Uint8Array;
  if (typeof d.bytecode === "string") {
    bytecode = hexToBytes(removeHexPrefix(d.bytecode));
  } else {
    bytecode = d.bytecode;
  }

  return SszDeployMessageSchema.serialize({
    code: bytecode,
    shardId: d.shardId,
    publicKey: pubkey,
    seqno: d.seqno ?? 0,
  });
};

export { prepareDeployData };
