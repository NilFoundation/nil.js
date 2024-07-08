import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  WalletV1,
  convertEthToWei,
  generateRandomPrivateKey,
  waitTillCompleted,
} from "../src";

import { encodeFunctionData, type Abi } from "viem";

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
  salt: 400n,
  shardId: 1,
  client,
  signer,
});
const walletAddress = await wallet.getAddressHex();

// biome-ignore lint/nursery/noConsole: <explanation>
console.log("walletAddress", walletAddress);

await faucet.withdrawToWithRetry(walletAddress, convertEthToWei(1));

await wallet.selfDeploy(true);
// biome-ignore lint/nursery/noConsole: <explanation>
console.log("Wallet deployed successfully");

// const hashFunds = await faucet.withdrawToWithRetry(addressR, 5_000_000n);

// await waitTillCompleted(client, 1, hashFunds);

const data = encodeFunctionData({
  abi: [
    {
      inputs: [{ internalType: "address", name: "dst", type: "address" }],
      name: "call",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "bytes", name: "", type: "bytes" },
      ],
      name: "verifyExternal",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "pure",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ] as Abi,
  functionName: "call",
  args: ["0x000168902c80551767a3d498aa68644b7288031c"],
});

const messageHash = await wallet.sendMessage({
  to: "0x0002797d26cbda538ab23dd1281b2c8b34b68a5f",
  data: data,
  value: 10_000_000n,
  gas: 1_000_000n,
});

await waitTillCompleted(client, 1, messageHash);

const receipt = await client.getMessageReceiptByHash(messageHash);

console.log("Contract call completed");
console.log("Transaction hash: ", messageHash);
console.log("Receipt: ", receipt);
