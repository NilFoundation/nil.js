import { bytesToHex, encodeFunctionData, hexToBigInt, numberToHex } from "viem";
import { testEnv } from "../../test/testEnv.js";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  MINTER_ABI,
  MINTER_ADDRESS,
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

test("mint and transfer tokens", async () => {
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
  await faucet.withdrawToWithRetry(walletAddress, convertEthToWei(0.1));

  await wallet.selfDeploy(true);

  const mintCount = 100_000_000n;

  const hashMessage = await wallet.sendMessage({
    to: MINTER_ADDRESS,
    gas: 1_000_000n,
    value: 100_000_000n,
    data: encodeFunctionData({
      abi: MINTER_ABI,
      functionName: "create",
      args: [mintCount, walletAddress, "MY_TOKEN", walletAddress],
    }),
  });

  await waitTillCompleted(client, 1, hashMessage);

  const n = hexToBigInt(walletAddress);

  const tokens = await client.getCurrencies(walletAddress, "latest");

  expect(tokens).toBeDefined();
  expect(Object.keys(tokens).length).toBeGreaterThan(0);
  expect(tokens[numberToHex(n)]).toBeDefined();
  expect(tokens[numberToHex(n)]).toBe(mintCount);

  const anotherAddress = WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 2,
    salt: 200n,
  });

  const transferCount = 100_000n;

  const sendHash = await wallet.sendMessage({
    to: anotherAddress,
    value: 10_000_000n,
    gas: 100_000n,
    tokens: [
      {
        id: n,
        amount: transferCount,
      },
    ],
  });

  await waitTillCompleted(client, 1, sendHash);

  const anotherTokens = await client.getCurrencies(
    bytesToHex(anotherAddress),
    "latest",
  );

  expect(anotherTokens).toBeDefined();
  expect(Object.keys(anotherTokens).length).toBeGreaterThan(0);
  expect(anotherTokens[numberToHex(n)]).toBeDefined();
  expect(anotherTokens[numberToHex(n)]).toBe(transferCount);
});
