import { type Hex, bytesToHex, encodeFunctionData, hexToBytes } from "viem";
import type { PublicClient } from "../clients/PublicClient.js";
import { ExternalMessageEnvelope } from "../message.js";
import FaucetAbi from "./Faucet.abi.json";

export class Faucet {
  static address = "0x000100000000000000000000000000000FA00CE7" as const;
  private client: PublicClient;
  constructor(client: PublicClient) {
    this.client = client;
  }
  async withdrawTo(address: Hex, value = 1000000000000000000n, seqno?: number) {
    const [refinedSeqno, chainId] = await Promise.all([
      seqno ?? this.client.getMessageCount(Faucet.address, "latest"),
      this.client.chainId(),
    ]);
    const calldata = encodeFunctionData({
      abi: FaucetAbi,
      functionName: "withdrawTo",
      args: [address.toLowerCase(), value],
    });
    const message = new ExternalMessageEnvelope({
      isDeploy: false,
      to: hexToBytes(Faucet.address),
      chainId,
      seqno: refinedSeqno,
      data: hexToBytes(calldata),
      authData: new Uint8Array(0),
    });
    const encodedMessage = message.encode();
    await this.client.sendRawMessage(bytesToHex(encodedMessage));
    return message.hash();
  }
}
