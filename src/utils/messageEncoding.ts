import { ExternalMessageEnvelope } from "../message.js";
import type { ISigner } from "../signers/index.js";
import type { ExternalMessage } from "../types/ExternalMessage.js";

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
