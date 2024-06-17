// Message is abstraction layer that will suit people who want to write their own Wallet

import { SszMessageSchema, SszSignedMessageSchema } from "./encoding/ssz.js";
import type { ISigner } from "./signers/index.js";
import type { ExternalMessage } from "./types/ExternalMessage.js";

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
    if (this.authData.length === 0) {
      throw new Error("AuthData is empty");
    }
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
    if (this.authData.length === 0) {
      throw new Error("AuthData is empty");
    }
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
}

export class InternalMessageEnvelope {}
