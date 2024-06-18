import { PublicClient } from "./clients/PublicClient.js";
import { Faucet } from "./faucet/Faucet.js";
import { LocalECDSAKeySigner } from "./signers/LocalECDSAKeySigner.js";
import { generateRandomPrivateKey } from "./signers/privateKey.js";
import { HttpTransport } from "./transport/HttpTransport.js";
import { WalletV1 } from "./wallets/V1/WalletV1.js";

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
const hash = await faucet.withdrawTo(walletAddress, 100n);

while (true) {
  try {
    const balance = await client.getBalance(walletAddress, "latest");
    if (balance > 0) {
      break;
    }
  } catch (e) {
    console.log("Error", e);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
console.log("fauce withdrawed");

await wallet.selfDeploy(true);

console.log("Wallet deployed");
console.log("Wallet address", walletAddress);
const code = await client.getCode(walletAddress, "latest");

console.log("Wallet code", code);
