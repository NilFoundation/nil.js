import { bytesToHex, encodeFunctionData } from "viem";
import { testEnv } from "../../test/testEnv.js";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  WalletV1,
  convertEthToWei,
  generateRandomPrivateKey,
  waitTillCompleted,
} from "../index.js";
const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: testEnv.endpoint,
  }),
  shardId: 1,
});

test("bounce", async () => {
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

  const anotherWallet = new WalletV1({
    pubkey: pubkey,
    salt: 200n,
    shardId: 1,
    client,
    signer,
  });

  await Promise.all([
    faucet.withdrawToWithRetry(walletAddress, convertEthToWei(0.1)),
    faucet.withdrawToWithRetry(
      anotherWallet.getAddressHex(),
      convertEthToWei(0.1),
    ),
  ]);

  await wallet.selfDeploy(true);
  await anotherWallet.selfDeploy(true);

  const bounceAddress = WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 1,
    salt: 300n,
  });

  const hash = await wallet.sendMessage({
    to: anotherWallet.getAddressHex(),
    value: 10_000_000n,
    bounceTo: bounceAddress,
    gas: 100_000n,
    data: encodeFunctionData({
      abi: WalletV1.abi,
      functionName: "syncCall",
      args: [walletAddress, 100_000, 10_000_000, "0x"],
    }),
  });

  const receipts = await waitTillCompleted(client, 1, hash);

  expect(receipts.length).toBeDefined();
  expect(receipts.some((r) => !r.success)).toBe(true);

  expect(receipts.length).toBeGreaterThan(2);

  const balance = await client.getBalance(bytesToHex(bounceAddress), "latest");

  expect(balance).toBeGreaterThan(0n);
});
