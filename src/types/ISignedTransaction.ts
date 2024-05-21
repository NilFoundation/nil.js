import type { ISignature } from "../signers/index.js";
import type { ITransaction } from "./ITransaction.js";

type ISignedTransaction = ITransaction & ISignature;

export type { ISignedTransaction };
