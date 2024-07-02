import { encodeFunctionData, hexToBigInt } from "viem";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  MINTER_ABI,
  MINTER_ADDRESS,
  PublicClient,
  WalletV1,
  generateRandomPrivateKey,
  waitTillCompleted,
} from "../src";

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: "http://127.0.0.1:8529",
  }),
  shardId: 1,
});

const faucet = new Faucet(client);

const signer = new LocalECDSAKeySigner({
  privateKey: generateRandomPrivateKey(),
});

const pubkey = await signer.getPublicKey();

const wallet = new WalletV1({
  pubkey: pubkey,
  salt: BigInt(Math.floor(Math.random() * 10000)),
  shardId: 1,
  client,
  signer,
});
const walletAddress = await wallet.getAddressHex();

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(walletAddress);

await faucet.withdrawToWithRetry(walletAddress, 100000n);
await wallet.selfDeploy(true);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Address of Wallet 1", walletAddress);

const walletTwo = new WalletV1({
  pubkey: pubkey,
  salt: BigInt(Math.floor(Math.random() * 10000)),
  shardId: 1,
  client,
  signer,
});
const walletTwoAddress = await walletTwo.getAddressHex();

await faucet.withdrawToWithRetry(walletTwoAddress, 100000n);
await walletTwo.selfDeploy(true);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Address of Wallet 2", walletTwoAddress);

const currencyCreationMessage = await wallet.sendMessage({
  to: MINTER_ADDRESS,
  gas: 1_000_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "create",
    args: [50_000n, walletAddress, "token", walletAddress],
  }),
});

await waitTillCompleted(client, 1, currencyCreationMessage);

const tokens = await client.getCurrencies(walletAddress, "latest");
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("tokens of Wallet 1, stage 1: ", tokens);

const currencyCreationMessageTwo = await walletTwo.sendMessage({
  to: MINTER_ADDRESS,
  gas: 1_000_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "create",
    args: [30_000n, walletTwoAddress, "new-token"],
  }),
});

await waitTillCompleted(client, 1, currencyCreationMessageTwo);

const transferMessage = await wallet.sendMessage({
  to: MINTER_ADDRESS,
  gas: 1_000_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "withdraw",
    args: [hexToBigInt(walletTwoAddress), 15_000n, walletAddress],
  }),
});

await waitTillCompleted(client, 1, transferMessage);

const tokensTwo = await client.getCurrencies(walletAddress, "latest");
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("tokens of Wallet 1, stage 2: ", tokensTwo);
