const defaultRpcEndpoint = "http://127.0.0.1:8529";

const endpoint = process.env.RPC_ENDPOINT ?? defaultRpcEndpoint;

export { endpoint };
