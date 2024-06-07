import { defaultAddress } from "../../test/mocks/address.js";
import { bytecode } from "../../test/mocks/contracts/simpleStorage/bytecode.js";
import { testEnv } from "../../test/testEnv.js";
import { HttpTransport, LocalKeySigner, addHexPrefix } from "../index.js";
import { WalletClient } from "./WalletClient.js";
import type { ISendMessage } from "./types/ISendMessage.js";

const signer = new LocalKeySigner({
  privateKey: testEnv.localPrivKey,
});

const client = new WalletClient({
  shardId: 1,
  signer: new LocalKeySigner({
    privateKey: testEnv.localPrivKey,
  }),
  transport: new HttpTransport({
    endpoint: testEnv.endpoint,
  }),
});

test("sendMessage", async () => {
  const address = signer.getAddress(client.getShardId());
  const message: ISendMessage = {
    to: `${addHexPrefix(address).slice(0, 40)}10`,
    value: 0n,
    gasLimit: 100n,
    gasPrice: 1n,
  };

  const result = await client.sendMessage(message);

  // sleep 4 seconds
  await new Promise((r) => setTimeout(r, 4000));

  expect(result).toBeDefined();
});

test("deployContract", async () => {
  const result = await client.deployContract({
    deployData: {
      bytecode: bytecode,
      shardId: client.getShardId(),
    },
    from: "0x0000186f9cc19906dba062697c3179c1cce6d4c4",
  });
  expect(result).toBeDefined();
});

// TODO: implement this test and this feature
// test("deployContract with constructor", async () => {

test("message encoding", async () => {
  const message = {
    data: new Uint8Array(0),
    to: addHexPrefix(defaultAddress),
    value: 0n,
    seqno: 100,
  };

  const encodedMessage = await client.encodeMessage(message);

  expect(encodedMessage).toBeDefined();
});
