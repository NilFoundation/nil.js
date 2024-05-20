import { accounts } from "../../test/mocks/accounts.js";
import { getPublicKey } from "./getPublicKey.js";

test("getPublicKey", async ({ expect }) => {
  const account = accounts[0];
  const input = account.privateKey;
  const expectedOutput = account.publicKey;

  const result = getPublicKey(input);

  expect(result).toBe(expectedOutput);
});
