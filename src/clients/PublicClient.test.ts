import { defaultAddress } from "../../test/mocks/address.js";
import { rawMsg } from "../../test/mocks/message.js";
import { masterShardId } from "../../test/mocks/shard.js";
import { testEnv } from "../../test/testEnv.js";
import { addHexPrefix } from "../index.js";
import { PublicClient } from "./PublicClient.js";

const client = new PublicClient({
  endpoint: testEnv.endpoint,
});

test("getBlockByHash", async ({ expect }) => {
  const block = await client.getBlockByHash(
    masterShardId,
    "0x158c4be17b52b92dc03cef7e8cd9cec64c6413175df3cce9f6ae1fb0d12106fa",
  );

  expect(block).toBeDefined();
});

test("getBlockByNumber", async ({ expect }) => {
  const block = await client.getBlockByNumber(masterShardId, "0x1b4");

  expect(block).toBeDefined();
});

// not implemented on the node
// test("getBlockMessageCountByNumber", async ({ expect }) => {
//   const count = await client.getBlockMessageCountByNumber(
//     masterShardId,
//     "0x1b4",
//   );

//   expect(count).toBeDefined();
// });

// not implemented on the node
// test("getBlockMessageCountByHash", async ({ expect }) => {
//   const count = await client.getBlockMessageCountByHash(
//     masterShardId,
//     "0x158c4be17b52b92dc03cef7e8cd9cec64c6413175df3cce9f6ae1fb0d12106fa",
//   );

//   expect(count).toBeDefined();
// });

// not implemented on the node
// test("getCode", async ({ expect }) => {
//   const code = await client.getCode(
//     masterShardId,
//     addHexPrefix(defaultAddress),
//     "0x1b4",
//   );

//   expect(code).toBeDefined();
// });

test("getMessageCount", async ({ expect }) => {
  const count = await client.getMessageCount(
    masterShardId,
    addHexPrefix(defaultAddress),
    "latest",
  );

  expect(count).toBeDefined();
});

test("getBalance", async ({ expect }) => {
  const balance = await client.getBalance(
    masterShardId,
    addHexPrefix(defaultAddress),
    "latest",
  );

  expect(balance).toBeDefined();
});

test("getMessageByHash", async ({ expect }) => {
  const message = await client.getMessageByHash(
    masterShardId,
    "0x158c4be17b52b92dc03cef7e8cd9cec64c6413175df3cce9f6ae1fb0d12106fa",
  );

  expect(message).toBeDefined();
});

test("getMessageReceiptByHash", async ({ expect }) => {
  const receipt = await client.getMessageReceiptByHash(
    masterShardId,
    "0x158c4be17b52b92dc03cef7e8cd9cec64c6413175df3cce9f6ae1fb0d12106fa",
  );

  expect(receipt).toBeDefined();
});

test("sendRawMessage", async ({ expect }) => {
  const hash = await client.sendRawMessage(rawMsg);

  expect(hash).toBeDefined();
});

test("getGasPrice", async ({ expect }) => {
  const gasPrice = await client.getGasPrice(masterShardId);

  expect(gasPrice).toBeDefined();
});
