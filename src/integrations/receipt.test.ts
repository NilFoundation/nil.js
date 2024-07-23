import { testEnv } from "../../test/testEnv.js";
import { Faucet, WalletV1 } from "../contracts/index.js";
import {
  HttpTransport,
  PublicClient,
  convertEthToWei,
  waitTillCompleted,
} from "../index.js";
import { LocalECDSAKeySigner } from "../signers/LocalECDSAKeySigner.js";
import { generateRandomPrivateKey } from "../signers/privateKey.js";

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: testEnv.endpoint,
  }),
  shardId: 1,
});

test("Receipt test", async ({ expect }) => {
  const faucet = new Faucet(client);

  const signer = new LocalECDSAKeySigner({
    privateKey: generateRandomPrivateKey(),
  });

  const pubkey = await signer.getPublicKey();

  const wallet = new WalletV1({
    pubkey: pubkey,
    salt: 100n,
    shardId: 1,
    client,
    signer,
  });
  const walletAddress = await wallet.getAddressHex();

  expect(walletAddress).toBeDefined();

  const faucetHash = await faucet.withdrawToWithRetry(
    walletAddress,
    convertEthToWei(0.1),
  );

  const receipts = await waitTillCompleted(client, 1, faucetHash);

  expect(receipts).toBeDefined();
  for (const receipt of receipts) {
    expect(receipt).toBeDefined();
    expect(receipt.gasUsed).toBeDefined();
  }
});
