<h1 align="center">Nil.js</h1>

<br />

<p align="center">
  =nil; Foundation Typescript client to interact with the Nil network.
</p>

<p align="center">
  <a href="https://github.com/NilFoundation/nil.js/actions/workflows/build.yaml">
    <picture>
      <img src="https://img.shields.io/github/actions/workflow/status/NilFoundation/nil.js/actions/workflows/build.yaml?color=%23212121">
    </picture>
  </a>
</p>

## Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [License](#license)

### Installation

```bash
npm install niljs
```

### Getting started

There are two clients in the library to interact with the Nil network.
The first one is the `PublicClient` class, which is used to interact with the Nil network without the need for a private key. It is used to get information about the network, such as block number and block hash.

```typescript
import { PublicClient } from "niljs";

const endpoint = "https://localhost:8259";
const publicClient = new PublicClient({ endpoint });

publicClient.getBalance("your_address").then((balance) => {
  console.log(balance);
});
```

The second one is the `WalletClient` class, which is used to interact with the Nil network with a private key. It is used to send transactions to the network.

```typescript
import { WalletClient } from "niljs";

const endpoint = "https://localhost:8259";
const walletClient = new WalletClient({ endpoint });

walletClient
  .sendTransaction({
    from: "your_address",
    to: "recipient_address",
    amount: 100,
  })
  .then((tx) => {
    console.log(tx);
  });
```

Initialize the Signer with the private key of the account you want to use to sign transactions.

```typescript
import { Signer } from "niljs";

const privateKey = "your_private_key";
const signer = new Signer({ privateKey });

signer.sign(new Uint8Array(32));
```

You can also sign transactions automatically by passing the Signer instance to the WalletClient.

```typescript
import { WalletClient } from "niljs";
import { Signer } from "niljs";

const endpoint = "https://localhost:8259";
const privateKey = "your_private_key";

const signer = new Signer({ privateKey });
const walletClient = new WalletClient({ endpoint, signer });
```

## Licence

[MIT](./LICENSE)
