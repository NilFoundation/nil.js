import { secp256k1 } from "@noble/curves/secp256k1";
import { accounts } from "../../test/mocks/accounts.js";
import { toHex } from "../index.js";
import { LocalKeySigner } from "./LocalKeySigner.js";

test("getPublicKey", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });

  const publicKey = signer.getPublicKey();

  expect(publicKey).toBe(accounts[0].publicKey);
});

test("getAddress", async () => {
  const privateKey = accounts[0].privateKey;
  const signer = new LocalKeySigner({ privateKey });

  const address = signer.getAddress();

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

  /**
   * Sign the message with the private key and verify the signature with the public key.
   */
  const signature = signer.sign(message);

  const verified = secp256k1.verify(
    toHex(message),
    signature,
    signer.getPublicKey(),
  );

  expect(verified).toBe(true);
});
