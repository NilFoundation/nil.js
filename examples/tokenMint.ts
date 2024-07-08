import { encodeFunctionData } from "viem";
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

await faucet.withdrawToWithRetry(walletAddress, convertEthToWei(1));
await wallet.selfDeploy(true);

const walletTwo = new WalletV1({
  pubkey: pubkey,
  salt: BigInt(Math.floor(Math.random() * 10000)),
  shardId: 1,
  client,
  signer,
});
const walletTwoAddress = await walletTwo.getAddressHex();

await faucet.withdrawToWithRetry(walletTwoAddress, convertEthToWei(1));
await walletTwo.selfDeploy(true);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(walletAddress);
// biome-ignore lint/nursery/noConsole: <explanation>
console.log(walletTwoAddress);

const currencyCreationMessage = await wallet.sendMessage({
  to: MINTER_ADDRESS,
  gas: 500_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "create",
    args: [10_000n, walletAddress, "token", walletAddress],
  }),
});

await waitTillCompleted(client, 1, currencyCreationMessage);

const currencyCreationMessageTwo = await walletTwo.sendMessage({
  to: MINTER_ADDRESS,
  gas: 500_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "create",
    args: [20_000n, walletTwoAddress, "new-token", walletAddress],
  }),
});

await waitTillCompleted(client, 1, currencyCreationMessageTwo);

const tokens = await client.getCurrencies(walletAddress, "latest");
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("tokens of Wallet 1: ", tokens);
