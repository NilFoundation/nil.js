import { Client, HTTPTransport, RequestManager } from "@open-rpc/client-js";

/**
 * Creates a new rpc client to leverage network json-rpc API.
 * RPC client uses http transport to send requests to the network.
 * Currently, the only supported transport is HTTP.
 * @example const client = createRPCClient("http://127.0.0.1:8529");
 */
const createRPCClient = (endpoint: string) => {
  const transport = new HTTPTransport(endpoint);
  const requestManager = new RequestManager([transport]);
  return new Client(requestManager);
};

export { createRPCClient };
