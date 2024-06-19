// const msg = new ExternalMessageEnvelope({
//   seqno: 1,
//   chainId: 0,
//   to: Uint8Array.from([
//     0, 1, 204, 168, 224, 144, 135, 60, 203, 252, 60, 97, 151, 204, 62, 49, 244,
//     197, 189, 52,
//   ]),
//   data: Uint8Array.from([
//     85, 181, 23, 203, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 10, 211, 82,
//     216, 110, 1, 81, 252, 219, 41, 68, 229, 79, 160, 98, 73, 251, 53, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 204, 168, 224, 144, 135, 60, 203, 252, 60,
//     97, 151, 204, 62, 49, 244, 197, 189, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 134, 160, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   ]),
//   isDeploy: false,
//   authData: Uint8Array.from([]),
// });

import { bytesToHex } from "viem";
import { Faucet } from "./faucet/Faucet.js";
import { LocalECDSAKeySigner } from "./signers/LocalECDSAKeySigner.js";
import { generateRandomPrivateKey } from "./signers/privateKey.js";
import { HttpTransport } from "./transport/index.js";
import { WalletV1 } from "./wallets/V1/WalletV1.js";
import { PublicClient } from "./clients/PublicClient.js";

// console.log(bytesToHex(msg.signingHash()));

// console.log(
//   "hash",
//   hash64(
//     hexToBytes(
//       "251e2905595df18364cf17ef0e344927e4a3dcfd24e96c9d4dc209e3421c02a5",
//     ),
//     hexToBytes(
//       "0000000000000000000000000000000000000000000000000000000000000000",
//     ),
//   ),
// );

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
  shardId: 1,
  client,
  signer,
  address: WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 1,
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

const chainId = await client.chainId();

const { hash, address } = await wallet.deployContract({
  bytecode: WalletV1.code,
  salt: 200n,
  abi: WalletV1.abi,
  args: [bytesToHex(Uint8Array.from([1, 2, 3, 4, 5]))],
  value: 10n,
  gas: 100000n,
  shardId: 1,
});

console.log("hash", hash);

// const deployMessage = externalDeploymentMessage(
//   {
//     bytecode: WalletV1.code,
//     salt: 200n,
//     shard: 1,
//     abi: WalletV1.abi,
//     args: [bytesToHex(Uint8Array.from([1, 2, 3, 4, 5]))],
//   },
//   chainId,
// );
// await faucet.withdrawTo(deployMessage.hexAddress(), 100000n);

// await deployMessage.send(client);
while (true) {
  try {
    const code = await client.getCode(address, "latest");
    if (code.length > 0) {
      console.log("Contract deployed");
      console.log("code", code);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (e) {}
}
