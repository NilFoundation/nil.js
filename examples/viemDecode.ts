import type { Abi } from "abitype";
import { WalletV1 } from "../src";
import { decodeFunctionResult } from "viem";

const iface = [
  {
    inputs: [
      { internalType: "bytes", name: "_pubkey", type: "bytes" },
      {
        internalType: "address",
        name: "_retailerContractAddress",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "createProduct",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProducts",
    outputs: [
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "string[]", name: "", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextProductId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "products",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "messageHash", type: "uint256" },
      { internalType: "bytes", name: "authData", type: "bytes" },
    ],
    name: "verifyExternal",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as Abi;

const res = decodeFunctionResult({
  abi: WalletV1.abi,
  data: "0xf5b8214a00000000000000000000000000025b21325a42a16fcc5b9824d7b19b4e6ea77900000000000000000000000000015182aca2f3a7cab377d2d4af5f0937a4824a00000000000000000000000000015182aca2f3a7cab377d2d4af5f0937a4824a00000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000004e7f348000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004c29b2f2000000000000000000000000000000000000000000000000000000000",
});

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(res);

// const resTwo = decodeFunctionResult({
//   abi: iface,
//   data: "0x00015182aCA2f3a7Cab377d2D4AF5f0937A4824A",
//   functionName: "getProducts",
// });

// // biome-ignore lint/nursery/noConsole: <explanation>
// console.log(resTwo);
