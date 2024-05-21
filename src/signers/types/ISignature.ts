import type { Hex } from "@noble/curves/abstract/utils";

/**
 * Interface for the Signature. It contains the r, s, and yParity values.
 */
type ISignature = {
  r: Hex;
  s: Hex;
  v?: bigint;
  yParity: number;
};

export type { ISignature };
