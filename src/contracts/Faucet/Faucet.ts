import { type Hex, bytesToHex, encodeFunctionData, hexToBytes } from "viem";
import type { PublicClient } from "../../clients/PublicClient.js";
import { ExternalMessageEnvelope } from "../../encoding/externalMessage.js";
import FaucetAbi from "./Faucet.abi.json";

/**
 * Faucet is a special contract that is used to top up other contracts in the =nil; devnet.
 *
 * @export
 * @class Faucet
 * @typedef {Faucet}
 */
export class Faucet {
  /**
   * The const address of the faucet contract.
   *
   * @static
   * @type {"0x000100000000000000000000000000000FA00CE7"}
   */
  static address = "0x000100000000000000000000000000000FA00CE7" as const;
  /**
   * The client to be used with the faucet contract.
   *
   * @private
   * @type {PublicClient}
   */
  private client: PublicClient;

  /**
   * Creates an instance of Faucet.
   *
   * @constructor
   * @param {PublicClient} client
   */
  constructor(client: PublicClient) {
    this.client = client;
  }

  /**
   * Withdraws the specified value to the given address.
   *
   * @async
   * @param {Hex} address The address to which the withdrawal should be made.
   * @param {bigint} [value=1000000000000000000n] The value that should be withdrawn to the given address.
   * @param {?number} [seqno] The sequence number of the withdrawal message.
   * @returns {Uint8Array} The hash of the withdrawal message.
   */
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
