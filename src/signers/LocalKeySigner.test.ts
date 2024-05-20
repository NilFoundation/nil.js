import { accounts } from "../../test/mocks/accounts.js";
import { LocalKeySigner } from "./LocalKeySigner.js";
import elliptic = require("elliptic");

const ec = new elliptic.ec("secp256k1");

test("LocalKeySigner should return public key", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });

  const publicKey = signer.getPublicKey();

  expect(publicKey).toBe(accounts[0].publicKey);
});

test("LocalKeySigner should throw error if invalid private key is provided", async () => {
  /**
   * The private key is invalid.
   */
  const privateKey = "0x0";
  expect(() => new LocalKeySigner({ privateKey })).toThrowError();
});

test("Signature should be valid", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });
  const transaction = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  /**
   * Sign the transaction with the private key and verify the signature with the public key.
   */
  const signature = signer.sign(transaction);
  const publicKey = ec.keyFromPublic(accounts[0].publicKey, "hex");
  const verified = publicKey.verify(transaction, signature);

  expect(verified).toBe(true);
});
