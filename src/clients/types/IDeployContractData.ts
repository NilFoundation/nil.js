import type { IDeployData } from "./IDeployData.js";
import type { ISendMessage } from "./ISendMessage.js";

/**
 * The data needed to send a deploy contract message.
 */
type IDeployContractData = {
  deployData: IDeployData;
} & Omit<ISendMessage, "data" | "value" | "to">;

export type { IDeployContractData };
