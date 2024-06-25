import type { PublicClient } from "../clients/PublicClient.js";
import type { Hex } from "../types/Hex.js";

export const waitTillCompleted = async (
  client: PublicClient,
  shardId: number,
  hash: Hex,
) => {
  const receipts = [];
  const hashes: [number, Hex][] = [[shardId, hash]];
  let cur = 0;
  while (cur !== hashes.length) {
    const [shardId, hash] = hashes[cur];
    const receipt = await client.getMessageReceiptByHash(hash, shardId);
    if (
      !receipt ||
      (receipt.outMessages !== null &&
        receipt.outputReceipts &&
        receipt.outputReceipts.filter((x) => x !== null).length !==
          receipt.outMessages.length)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    cur++;
    receipts.push(receipt);
    if (receipt.outputReceipts) {
      for (const r of receipt.outputReceipts) {
        hashes.push([r.shardId, r.messageHash]);
      }
    }
  }

  return receipts;
};
