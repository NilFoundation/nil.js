import type { Abi } from "abitype";
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

// const res = decodeFunctionData({
//   abi: WalletV1.abi,
//   data: "0x2bb1ae7c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008900a08601000000000000000000000000000000000000000000000000000000000000032774f4962f37c378bcbf6ee8081b7460befd000000000000000000000000000000000000000000000000000000000000000000000000000000008500000040420f000000000000000000000000000000000000000000000000000000000085000000c29b2f200000000000000000000000000000000000000000000000",
// });

// // biome-ignore lint/nursery/noConsole: <explanation>
// console.log(res);

const resTwo = decodeFunctionResult({
  abi: iface,
  data: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b6e65772d70726f64756374000000000000000000000000000000000000000000",
  functionName: "getProducts",
});

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(resTwo);
