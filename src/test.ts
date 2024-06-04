import { bytecode } from "../test/mocks/contracts/simpleStorage/bytecode.js";
import { testEnv } from "../test/testEnv.js";
import { WalletClient } from "./clients/WalletClient.js";
import { bytesToHex, hexToBytes } from "./encoding/index.js";
import { SszDeployMessageSchema, initZeroHashes } from "./encoding/ssz.js";
import { LocalKeySigner } from "./signers/LocalKeySigner.js";
initZeroHashes();

const signer = new LocalKeySigner({
  privateKey: testEnv.localPrivKey,
});

const client = new WalletClient({
  endpoint: "http://127.0.0.1:8529/",
  shardId: 1,
  signer,
});
console.log(signer.getPublicKey());
const pubKey = signer.getPublicKey();
let pubKeyBytes: Uint8Array;
if (typeof pubKey === "string") {
  pubKeyBytes = hexToBytes(pubKey.slice(2));
} else {
  pubKeyBytes = pubKey;
}

console.log("pubkey bytes", pubKeyBytes);

// for (let i = 0; i < pubKeyBytes.length; i++) {
//   pubKeyBytes[i] = 0;
// }

const seqno = await client.getMessageCount(signer.getAddress(1), "latest");

console.log("seqno", seqno);

const deployMessage = SszDeployMessageSchema.serialize({
  seqno: seqno,
  shardId: 1,
  publicKey: pubKeyBytes,
  code: hexToBytes(bytecode.slice(2)),
});

console.log("deploy message", bytesToHex(deployMessage));

const message = {
  data: deployMessage,
  seqno: seqno,
  to: "0x0000000000000000000000000000000000000000",
  value: 0n,
  gasPrice: 10000000000n,
  gasLimit: 1000000n,
};

const encodedMessage = await client.encodeMessage(message);

console.log("encode message", encodedMessage);

console.log(`hash 0x${bytesToHex(encodedMessage.hash)}`);

await client.sendRawMessage(`0x${bytesToHex(encodedMessage.bytes)}`);

while (true) {
  const receipt = await client.getMessageReceiptByHash(
    `0x${bytesToHex(encodedMessage.hash)}`,
  );
  console.log("receipt", receipt);
  if (receipt) {
    break;
  }
  // sleep second
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

// expect(encodedMessage).toBeDefined();

process.exit(0);
