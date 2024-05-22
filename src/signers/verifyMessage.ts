import type { Hex } from "@noble/curves/abstract/utils";
import type { ISignature } from "./index.js";

const verifyMessage = async (
  signature: ISignature,
  messageHash: Uint8Array,
  fullPublicKey: Hex,
) => {
  //
};
