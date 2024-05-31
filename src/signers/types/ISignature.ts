/**
 * Interface for the Signature. It contains the r, s, and yParity values.
 */
type ISignature = {
  r: bigint;
  s: bigint;
  v: number;
};

export type { ISignature };
