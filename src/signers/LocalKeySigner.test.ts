import { accounts } from "../../test/mocks/accounts.js";
import { removeHexPrefix } from "../index.js";
import { LocalKeySigner } from "./LocalKeySigner.js";

test("getPublicKey", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });

  const publicKey = signer.getPublicKey();

  expect(removeHexPrefix(publicKey)).toBe(
    removeHexPrefix(accounts[0].publicKey),
  );
});

test("getAddress", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });

  const address = signer.getAddress(accounts[0].shardId);

  expect(address).toBeDefined();
});

test("LocalKeySigner should throw error if invalid private key is provided", async () => {
  /**
   * The private key is invalid.
   */
  const privateKey = "0x0";
  expect(() => new LocalKeySigner({ privateKey })).toThrowError();
});

test("sign", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });
  const message = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const signature = signer.sign(message);

  expect(signature).toBeDefined();
});
