import { defaultAddress } from "../../test/mocks/address.js";
import { bytecode as precompiledContractBytecode } from "../../test/mocks/contracts/simpleStorage/bytecode.js";
import { testEnv } from "../../test/testEnv.js";
import { type IMessage, LocalKeySigner, addHexPrefix } from "../index.js";
import { WalletClient } from "./WalletClient.js";

const client = new WalletClient({
  endpoint: testEnv.endpoint,
  shardId: 0,
  signer: new LocalKeySigner({
    privateKey: testEnv.localPrivKey,
  }),
});

test("prepareMessage", async () => {
  const message = {
    to: addHexPrefix(defaultAddress),
    seqno: 0,
  };

  const preparedMessage = await client.prepareMessage(message as IMessage);

  expect(preparedMessage.from).toBeDefined();
  expect(preparedMessage.gasPrice).toBeDefined();
});

test("sendMessage", async () => {
  const message = {
    to: addHexPrefix(defaultAddress),
    value: 0n,
    seqno: 0,
  };

  const result = await client.sendMessage(message);

  expect(result).toBeDefined();
});

test("deployContract", async () => {
  const result = await client.deployContract({
    deployData: {
      bytecode: precompiledContractBytecode,
    },
    seqno: 10000,
    from: "0x0000186f9cc19906dba062697c3179c1cce6d4c4",
  });

  expect(result).toBeDefined();
});

// TODO: implement this test and this feature
// test("deployContract with constructor", async () => {
