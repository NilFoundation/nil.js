import type { IDeployData } from "../clients/types/IDeployData.js";
import { removeHexPrefix } from "../index.js";
import { hexToBytes } from "./fromHex.js";

/**
 * Prepare deploy data.
 * @param d - Deploy data
 * @returns Deploy data as bytes
 */
const prepareDeployData = (d: IDeployData) => {
  return hexToBytes(removeHexPrefix(d.bytecode));
};

export { prepareDeployData };
