import { hexToBytes } from "@noble/curves/abstract/utils";
import invariant from "tiny-invariant";
import type { IDeployData } from "../clients/types/IDeployData.js";
import { removeHexPrefix } from "../utils/hex.js";
import { SszDeployMessageSchema } from "./ssz.js";

/**
 * Prepare deploy data.
 * @param d - Deploy data
 * @returns Deploy data as bytes
 */
const prepareDeployData = ({
  shardId,
  seqno = 0,
  bytecode,
  pubkey,
}: IDeployData): Uint8Array => {
  let publicKey = new Uint8Array();

  if (pubkey) {
    if (typeof pubkey === "string") {
      pubkey = hexToBytes(removeHexPrefix(pubkey));
    } else {
      publicKey = pubkey;
    }
  } else {
    pubkey = new Uint8Array(33).fill(0);
  }

  invariant(pubkey.length === 33, "Public key must be 33 bytes long");

  let code: Uint8Array;

  if (typeof bytecode === "string") {
    code = hexToBytes(removeHexPrefix(bytecode));
  } else {
    code = bytecode;
  }

  return SszDeployMessageSchema.serialize({
    code,
    shardId,
    publicKey,
    seqno,
  });
};

export { prepareDeployData };
