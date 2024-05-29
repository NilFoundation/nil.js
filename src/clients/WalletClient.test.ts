import { endpoint } from "../../test/mocks/endpoint.js";

import abi from "../../test/mocks/contracts/simpleStorage/bin/SimpleStorage.abi";
import { type IMessage, LocalKeySigner, generatePrivateKey } from "../index.js";
import { WalletClient } from "./WalletClient.js";

const client = new WalletClient({
  endpoint,
  signer: new LocalKeySigner({
    privateKey: generatePrivateKey(),
  }),
});

test("sendMessage", async ({ expect }) => {
  const newMessage = {
    to: "0x1234",
    data: 100,
  } as unknown as IMessage;

  const hash = await client.sendMessage(newMessage);

  expect(hash).toBeDefined();
});

test("sendMessage with from field", async ({ expect }) => {
  const newMessage = {
    from: "0x1234",
    to: "0x1234",
    data: 100,
  } as unknown as IMessage;

  const hash = await client.sendMessage(newMessage);

  expect(hash).toBeDefined();
});

test("sendMessage with from field and shouldValidate false", async ({
  expect,
}) => {
  const newMessage = {
    from: "0x1234",
    to: "0x1234",
    data: 100,
  } as unknown as IMessage;

  const hash = await client.sendMessage(newMessage, { shouldValidate: false });

  expect(hash).toBeDefined();
});

test("sendRawMessage", async ({ expect }) => {
  const newMessage = {
    to: "0x1234",
    data: 100,
  } as unknown as IMessage;
  const signedMessage = client.signMessage(newMessage);

  const hash = await client.sendRawMessage(signedMessage);

  expect(hash).toBeDefined();
});

test("Deploy contract", async ({ expect }) => {
  const newMessage = {
    data: 100,
  } as unknown as IMessage;

  const hash = await client.deployContract({
    bytecode: new Uint8Array(),
    args: new Uint8Array(),
    abi: abi,
  });

  expect(hash).toBeDefined();
});
