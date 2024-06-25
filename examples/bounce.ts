import { bytesToHex, encodeFunctionData } from "viem";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
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

const anotherWallet = new WalletV1({
  pubkey: pubkey,
  salt: 200n,
  shardId: 1,
  client,
  signer,
  address: WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 1,
    salt: 200n,
  }),
});

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("walletAddress", walletAddress);
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("anotherWallet", anotherWallet.getAddressHex());

const seqno = await client.getMessageCount(Faucet.address, "latest");

const faucetHash1 = await faucet.withdrawTo(walletAddress, 100_000_000n, seqno);
const faucetHash2 = await faucet.withdrawTo(
  anotherWallet.getAddressHex(),
  100_000_000n,
  seqno + 1,
);

await waitTillCompleted(client, 1, bytesToHex(faucetHash1));
await waitTillCompleted(client, 1, bytesToHex(faucetHash2));
await wallet.selfDeploy(true);
await anotherWallet.selfDeploy(true);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Wallet deployed successfully");

const bounceAddress = WalletV1.calculateWalletAddress({
  pubKey: pubkey,
  shardId: 1,
  salt: 300n,
});

// bounce message
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

await waitTillCompleted(client, 1, hash);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("bounce address", bytesToHex(bounceAddress));

const balance = await client.getBalance(bytesToHex(bounceAddress), "latest");

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("balance", balance);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Message sent successfully");
