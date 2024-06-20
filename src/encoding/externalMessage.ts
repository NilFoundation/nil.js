import { bytesToHex } from "viem";
import type { PublicClient } from "../clients/PublicClient.js";
import type { ISigner } from "../signers/index.js";
import type { ExternalMessage } from "../types/ExternalMessage.js";
import type { IDeployData } from "../types/IDeployData.js";
import { prepareDeployPart } from "./deployPart.js";
import { SszMessageSchema, SszSignedMessageSchema } from "./ssz.js";

export class ExternalMessageEnvelope {
  isDeploy: boolean;
  to: Uint8Array;
  chainId: number;
  seqno: number;
  data: Uint8Array;
  authData: Uint8Array;
  constructor({
    isDeploy,
    to,
    chainId,
    seqno,
    data,
    authData,
  }: ExternalMessage) {
    this.isDeploy = isDeploy;
    this.to = to;
    this.chainId = chainId;
    this.seqno = seqno;
    this.data = data;
    this.authData = authData;
  }
  public encode(): Uint8Array {
    return SszSignedMessageSchema.serialize({
      seqno: this.seqno,
      chainId: this.chainId,
      to: this.to,
      data: this.data,
      deploy: this.isDeploy,
      authData: this.authData,
    });
  }
  public hash(): Uint8Array {
    return SszSignedMessageSchema.hashTreeRoot({
      seqno: this.seqno,
      chainId: this.chainId,
      to: this.to,
      data: this.data,
      deploy: this.isDeploy,
      authData: this.authData,
    });
  }
  public signingHash(): Uint8Array {
    // print all the fields
    return SszMessageSchema.hashTreeRoot({
      seqno: this.seqno,
      chainId: this.chainId,
      to: this.to,
      data: this.data,
      deploy: this.isDeploy,
    });
  }
  public async encodeWithSignature(signer: ISigner): Promise<{
    raw: Uint8Array;
    hash: Uint8Array;
  }> {
    const signature = await this.sign(signer);
    const raw = SszSignedMessageSchema.serialize({
      seqno: this.seqno,
      chainId: this.chainId,
      to: this.to,
      data: this.data,
      deploy: this.isDeploy,
      authData: signature,
    });
    const hash = SszSignedMessageSchema.hashTreeRoot({
      seqno: this.seqno,
      chainId: this.chainId,
      to: this.to,
      data: this.data,
      deploy: this.isDeploy,
      authData: signature,
    });
    return { raw, hash };
  }
  // return signature
  public async sign(signer: ISigner): Promise<Uint8Array> {
    return signer.sign(this.signingHash());
  }
  public async updateAuthdata(signer: ISigner): Promise<Uint8Array> {
    this.authData = await this.sign(signer);
    return this.authData;
  }
  public hexAddress(): `0x${string}` {
    return bytesToHex(this.to);
  }
  public send(client: PublicClient) {
    return client.sendRawMessage(this.encode());
  }
}

export class InternalMessageEnvelope {}

export const externalDeploymentMessage = (
  data: IDeployData,
  chainId: number,
): ExternalMessageEnvelope => {
  const { data: deployData, address } = prepareDeployPart(data);
  return new ExternalMessageEnvelope({
    isDeploy: true,
    to: address,
    chainId,
    seqno: 0,
    data: deployData,
    authData: new Uint8Array(0),
  });
};

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
