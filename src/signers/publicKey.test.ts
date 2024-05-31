import { accounts } from "../../test/mocks/accounts.js";
import { generateRandomPrivateKey } from "./privateKey.js";
import { getPublicKey } from "./publicKey.js";

test("generatePrivateKey", async ({ expect }) => {
  const result = generateRandomPrivateKey();

  expect(result).toBeDefined();
});

test("getPublicKey", async ({ expect }) => {
  const account = accounts[0];
  const input = account.privateKey;
  const expectedOutput = account.publicKey;

  const result = getPublicKey(input);

  expect(result).toBe(expectedOutput);
});

test("getAddressFromPublicKey", async ({ expect }) => {
  // const account = accounts[0];
  // const input = account.publicKey;
  // const expectedOutput = account.address;
  // const result = getAddressFromPublicKey(input);
  // expect(result).toBe(expectedOutput);
});
