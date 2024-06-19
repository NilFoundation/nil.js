import { bytesToHex, encodeDeployData, hexToBytes } from "viem";
import type { IDeployData } from "../types/IDeployData.js";
import { calculateAddress } from "../utils/address.js";
import { refineSalt } from "../utils/refiners.js";

export const prepareDeployPart = (
  data: IDeployData,
): { data: Uint8Array; address: Uint8Array } => {
  const byteSalt = refineSalt(data.salt);
  let constructorData: Uint8Array;
  if (data.abi) {
    constructorData = hexToBytes(
      encodeDeployData({
        abi: data.abi,
        bytecode: bytesToHex(data.bytecode),
        args: data.args || [],
      }),
    );
  } else {
    constructorData = data.bytecode;
  }
  const bytecode = new Uint8Array([...constructorData, ...byteSalt]);
  const address = calculateAddress(data.shard, constructorData, byteSalt);
  return { data: bytecode, address: address };
};
