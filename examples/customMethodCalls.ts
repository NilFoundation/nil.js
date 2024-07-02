import type { Abi } from "viem";
import {
  Faucet,
  HttpTransport,
  LocalECDSAKeySigner,
  PublicClient,
  WalletV1,
  waitTillCompleted,
} from "../src";

const MAbi = require("./Manufacturer.abi.json") as Abi;
const RAbi = require("./Retailer.abi.json") as Abi;
const signer = new LocalECDSAKeySigner({
  privateKey:
    "0x09cae8b09eed60da35c7e463941e010dbfa1f1de64b56db7db4b612aca8ac25f",
});

const pubkey = await signer.getPublicKey();

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: "http://127.0.0.1:8529",
  }),
  shardId: 1,
});

const wallet = new WalletV1({
  pubkey: pubkey,
  salt: 200n,
  shardId: 1,
  client,
  signer,
  address: "0x00019460903263781e2024Ab7592a436a9eA5461",
});

const faucet = new Faucet(client);
const hash = await faucet.withdrawTo(
  "0x000299cafc1cef9b26ca17db1946130764fd0d65",
  1000000n,
);

await waitTillCompleted(client, 1, hash);
// await wallet.sendMessage({
//   to: hexToBytes("0x00026140bdb726b4ddd6fe9f3d97b398115160a7"),
//   data: encodeFunctionData({
//     abi: MAbi,
//     functionName: "setRetailerContractAddress",
//     args: ["0x000181652b9c1f311b735f74c78d40e77b1d255a" as "0x{string}"],
//   }),
//   gas: 500000n,
//   value: 5000000n,
// });

// await wallet.sendMessage({
//   to: hexToBytes("0x000181652b9c1f311b735f74c78d40e77b1d255a"),
//   data: encodeFunctionData({
//     abi: RAbi,
//     functionName: "orderProduct",
//     args: [
//       "0x00026140bdb726b4ddd6fe9f3d97b398115160a7" as "0x{string}",
//       "coolproduct",
//     ],
//   }),
//   gas: 100000n,
//   value: 1000000n,
// });
