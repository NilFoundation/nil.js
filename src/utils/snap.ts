import {} from "@metamask/snaps-rpc-methods";
import type { Eip1193Provider } from "../types/window.js";

/**
 * Name of the nil snap.
 */
const snapName = "@nilfoundation/nil-metamask-snap";

/**
 * Requests permission to use the nil snap.
 * @param provider - Eip1193Provider instance
 * @returns provider
 */
const requestMetaMaskSnap = async (provider: Eip1193Provider) => {
  await provider.request({
    method: "wallet_requestSnaps",
    params: {
      [`npm:${snapName}`]: {},
    },
  });

  return provider;
};

export { requestMetaMaskSnap };
