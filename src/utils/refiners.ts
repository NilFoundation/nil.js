import { hexToBytes } from "viem";

export const refineSalt = (salt: Uint8Array | bigint): Uint8Array => {
  if (typeof salt === "bigint") {
    return hexToBytes(`0x${salt.toString(16).padStart(64, "0")}`).slice(0, 32);
  }
  if (salt.length !== 32) {
    throw new Error("Salt must be 32 bytes");
  }
  return salt;
};

export const refineCompressedPublicKey = (
  pubkey: Uint8Array | `0x${string}`,
): Uint8Array => {
  if (typeof pubkey === "string") {
    const bytes = hexToBytes(pubkey);
    if (bytes.length !== 33) {
      throw new Error("Invalid pubkey length");
    }
    return bytes;
  }
  if (pubkey.length !== 33) {
    throw new Error("Invalid pubkey length");
  }
  return pubkey;
};
