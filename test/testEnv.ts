const defaultRpcEndpoint = "http://127.0.0.1:8529";
const defaultPrivateKey =
  "41285f03e8692676bf80a98e4052a008026427a7302ca97cb06edcd60689850b";

const testEnv = {
  localPrivKey: process.env.LOCAL_PRIV_KEY ?? defaultPrivateKey,
  endpoint: process.env.RPC_ENDPOINT ?? defaultRpcEndpoint,
} as const;

export { testEnv };
