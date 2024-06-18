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
const anotherWallet = new WalletV1({
  pubkey: pubkey,
  salt: 200n,
  shardId: 2,
  client,
  signer,
  address: WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 2,
    salt: 200n,
  }),
});
const anotherWalletAddress = await anotherWallet.getAddressHex();
console.log("anotherWalletAddress", anotherWalletAddress);
const seqno = await client.getMessageCount(Faucet.address, "latest");
await faucet.withdrawTo(walletAddress, 100000n, seqno);
await faucet.withdrawTo(anotherWalletAddress, 100000n, seqno + 1);

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
// await anotherWallet.selfDeploy(true);

console.log("Wallet deployed");
console.log("Wallet address", walletAddress);
const code = await client.getCode(walletAddress, "latest");

console.log("Wallet code", code);

const messageHash = await wallet.sendMessage({
  to: anotherWalletAddress,
  value: 1n,
  gas: 100000n,
  data: new Uint8Array(0),
});

console.log("Message hash", messageHash);
while (true) {
  try {
    // const receipt = await client.getMessageReceiptByHash(messageHash);
    // console.log("Receipt", receipt);
    // if (receipt) {
    //   for (const out of receipt.outMessages) {
    //     const outReceipt = await client.getMessageReceiptByHash(messageHash);
    //     console.log("Out receipt", outReceipt);
    //   }
    // }
    const balance = await client.getBalance(anotherWalletAddress, "latest");
    console.log("Balance", balance);
    if (balance > 100000n) {
      break;
    }
  } catch (e) {}

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
