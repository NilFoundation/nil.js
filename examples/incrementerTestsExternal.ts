import { type Abi, bytesToHex, hexToBytes, encodeFunctionData } from "viem";
import {
  Faucet,
  HttpTransport,
  PublicClient,
  waitTillCompleted,
  externalDeploymentMessage,
} from "../src";

const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: "http://127.0.0.1:8529",
  }),
  shardId: 1,
});

const faucet = new Faucet(client);

const chainId = await client.chainId();

const deploymentMessage = externalDeploymentMessage(
  {
    salt: BigInt(Math.floor(Math.random() * 10000)),
    shard: 1,
    bytecode: hexToBytes(
      "0x608060405234801561000f575f80fd5b506101508061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063d09de08a1461002d575b5f80fd5b610035610037565b005b60015f8082825461004891906100bf565b925050819055507f93fe6d397c74fdf1402a8b72e47b68512f0510d7b98a4bc4cbdf6ac7108b3c595f5460405161007f9190610101565b60405180910390a1565b5f819050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6100c982610089565b91506100d483610089565b92508282019050808211156100ec576100eb610092565b5b92915050565b6100fb81610089565b82525050565b5f6020820190506101145f8301846100f2565b9291505056fea2646970667358221220c72bf76f313d1844bb3f46d509f798237b3bb8e57171435c38ab5ad78cffaf4364736f6c63430008150033",
    ),
  },
  chainId,
);
const addrS = bytesToHex(deploymentMessage.to);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(addrS);

const faucetHash = await faucet.withdrawTo(addrS, 1_000_000_000_000n);
await deploymentMessage.send(client);
const receipts = await waitTillCompleted(client, 1, bytesToHex(faucetHash));

const hash = await client.sendRawMessage(
  hexToBytes(
    encodeFunctionData({
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "newValue",
              type: "uint256",
            },
          ],
          name: "ValueChanged",
          type: "event",
        },
        {
          inputs: [],
          name: "increment",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ] as Abi,
      functionName: "increment",
      args: [],
    }),
  ),
);

await waitTillCompleted(client, 1, hash);

// biome-ignore lint/nursery/noConsole: <explanation>
console.log(hash);
