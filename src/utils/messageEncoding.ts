import { bytesToHex, encodeDeployData, hexToBytes } from "viem";
import { ExternalMessageEnvelope } from "../message.js";
import type { ISigner } from "../signers/index.js";
import type { ExternalMessage } from "../types/ExternalMessage.js";
import type { IDeployData } from "../types/IDeployData.js";
import { calculateAddress } from "./address.js";

export const externalMessageEncode = async (
  params: Omit<ExternalMessage, "authData">,
  signer: ISigner,
): Promise<{ raw: Uint8Array; hash: Uint8Array }> => {
  const message = new ExternalMessageEnvelope({
    ...params,
    authData: new Uint8Array(0),
  });
  const res = await message.encodeWithSignature(signer);
  return res;
};

export const prepareDeployPart = (
  data: IDeployData,
): { data: Uint8Array; address: Uint8Array } => {
  let byteSalt: Uint8Array;
  if (typeof data.salt === "bigint") {
    byteSalt = hexToBytes(
      `0x${data.salt.toString(16).padStart(64, "0")}`,
    ).slice(0, 32);
  } else {
    byteSalt = data.salt;
  }
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
  console.log("constructorData", constructorData);
  console.log("byteSalt", byteSalt);
  const bytecode = new Uint8Array([...constructorData, ...byteSalt]);
  const address = calculateAddress(data.shard, constructorData, byteSalt);
  return { data: bytecode, address: address };
};
