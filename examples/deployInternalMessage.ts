import { bytesToHex } from "viem";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  WalletV1,
  generateRandomPrivateKey,
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

console.log("walletAddress", walletAddress);

await faucet.withdrawTo(walletAddress, 10000000n);

while (true) {
  const balance = await client.getBalance(walletAddress, "latest");
  if (balance > 0) {
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
await wallet.selfDeploy(true);

console.log("Wallet deployed successfully");

const { address } = await wallet.deployContract({
  bytecode: WalletV1.code,
  abi: WalletV1.abi,
  args: [bytesToHex(pubkey)],
  value: 10n,
  gas: 1000000n,
  salt: 200n,
  shardId: 1,
});

while (true) {
  const balance = await client.getBalance(address, "latest");
  if (balance > 0) {
    console.log("balance", balance);
    const code = await client.getCode(address, "latest");
    console.log("code", bytesToHex(code));
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

console.log("Another wallet deployed successfully");
