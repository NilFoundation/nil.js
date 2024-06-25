import { bytesToHex, encodeFunctionData, hexToBigInt } from "viem";
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
  salt: 100n,
  shardId: 1,
  client,
  signer,
  address: WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 1,
    salt: 100n,
  }),
});
const walletAddress = await wallet.getAddressHex();
const faucetHash = await faucet.withdrawTo(walletAddress, 1_000_000_000_000n);

await waitTillCompleted(client, 1, bytesToHex(faucetHash));
await wallet.selfDeploy(true);
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Wallet deployed successfully");
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("walletAddress", walletAddress);

const hashMessage = await wallet.sendMessage({
  to: MINTER_ADDRESS,
  gas: 1_000_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "create",
    args: [100_000_000n, walletAddress],
  }),
});

await waitTillCompleted(client, 1, hashMessage);

const n = hexToBigInt(walletAddress);
const hashSendMessage = await wallet.sendMessage({
  to: MINTER_ADDRESS,
  gas: 1_000_000n,
  value: 100_000_000n,
  data: encodeFunctionData({
    abi: MINTER_ABI,
    functionName: "transfer",
    args: [n, 100_000_000n, walletAddress],
  }),
});

const receipts = await waitTillCompleted(client, 1, hashSendMessage);
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("receipts", receipts);

const tokens = await client.getCurrencies(walletAddress, "latest");
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("tokens", tokens);
