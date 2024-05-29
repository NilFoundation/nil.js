import type { IMessage } from "../../index.js";
import type { IDeployData } from "../../types/IDeployData.js";

/**
 * The options for deploying a contract.
 */
type IDeployContractOption = IDeployData &
  Pick<IMessage, "from" | "gasPrice" | "to">;

export type { IDeployContractOption };
