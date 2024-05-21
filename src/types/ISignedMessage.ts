import type { ISignature } from "../signers/index.js";
import type { IMessage } from "./IMessage.js";

type ISignedMessage = IMessage & ISignature;

export type { ISignedMessage };
