<h1 align="center">Nil.js</h1>

<br />

<p align="center">
  The TypeScript client library for interacting with the =nil; network.
</p>

<row style="display: flex; gap: 10px;"><p align="center">
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/github/actions/workflow/status/NilFoundation/nil.js/actions/workflows/build.yaml?color=%23212121"/>
    </picture>
  </a>
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/npm/dy/niljs"/>
    </picture>
  </a>
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/github/stars/NilFoundation/nil.js"/>
    </picture>
  </a>
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/npm/v/niljs"/>
    </picture>
  </a>
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/github/forks/NilFoundation/nil.js"/>
    </picture>
  </a>
</p>
</row>

## Table of contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Usage](#usage)
- [License](#license)

### Installation

```bash
npm install @nilfoundation/niljs
```

### Getting started

`PublicClient` is used for performing read-only requests to =nil; that do not require authentication (e.g., attaining information about a block).

To initialize a `PublicClient`:

```typescript
const client = new PublicClient({
  transport: new HttpTransport({
    endpoint: "http://127.0.0.1:8529",
  }),
  shardId: 1,
});
```

`shardId` is a concept unique to =nil; in that it designates the execution shard where the wallet should be deployed. Execution shards manage portions of the global state and are coordinated by the main shard.

`WalletV1` is a class representing a wallet (in =nil; a wallet is just a smart contract) that allows for signing messages and performing requests that require authentication.

To deploy a wallet:

```typescript
const pubkey = await signer.getPublicKey();

const wallet = new WalletV1({
  pubkey: pubkey,
  salt: 100n,
  shardId: 1,
  client,
  signer,
  address: WalletV1.calculateWalletAddress({
    pubKey: pubkey,
    shardId: 1,
    salt: 100n,
  }),
});
const walletAddress = await wallet.getAddressHex();
```

The `Faucet` contract is for 'topping up' an address on the =nil; devnet. The faucet contract is always deployed at a pre-defined static address. To initialize a faucet instance:

```typescript
await faucet.withdrawTo(walletAddress, 100000n);
const faucet = new Faucet(client);
```

In =nil;, the address for a wallet must be 'topped up' first before deploying the wallet. To 'top up' an existing address:

```typescript
const deploymentMessage = externalDeploymentMessage(
  {
    salt: 100n,
    shard: 1,
    bytecode: WalletV1.code,
    abi: WalletV1.abi,
    args: [bytesToHex(pubkey)],
  },
  chainId,
);
const addr = bytesToHex(deploymentMessage.to);
console.log("walletAddress", addr);
```

## Usage

In =nil;, it is possible to call functions asynchronously. When a contract makes an async call, a new transaction is spawned. When this transaction is processed, the function call itself is executed. 

It is possible to make async calls within the confines of the same shard or between contracts deployed on different shards.

To perform an async call:

```typescript
const anotherAddress = WalletV1.calculateWalletAddress({
  pubKey: pubkey,
  shardId: 1,
  salt: 200n,
});

await wallet.sendMessage({
  to: anotherAddress,
  value: 10n,
  gas: 100000n,
});
```

To perform a sync call:

```typescript
const anotherAddress = WalletV1.calculateWalletAddress({
  pubKey: pubkey,
  shardId: 1,
  salt: 200n,
});

await wallet.syncSendMessage({
  to: anotherAddress,
  value: 10n,
  gas: 100000n,
});
```

It is only possible to perform sync calls within the confines of one shard.

## Licence

[MIT](./LICENSE)
