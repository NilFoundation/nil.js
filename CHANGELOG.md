# niljs

## 0.6.0

### Minor Changes

- [#62](https://github.com/NilFoundation/nil.js/pull/62) [`5165b65`](https://github.com/NilFoundation/nil.js/commit/5165b650f5a83cb47e5190e7f6625c65390feb19) Thanks [@KlonD90](https://github.com/KlonD90)! - Change wallet configuration. Now address will be automatically calculated from shard and salt if it's not provided. Also additionally now deploy data receive a hex as alternative data. Added tests to wallet. Added mock transport.

### Patch Changes

- [#64](https://github.com/NilFoundation/nil.js/pull/64) [`653d1de`](https://github.com/NilFoundation/nil.js/commit/653d1de6f879908245417002e3d1ef1f81c902b5) Thanks [@KlonD90](https://github.com/KlonD90)! - Add integration tests

- [#65](https://github.com/NilFoundation/nil.js/pull/65) [`d93cd03`](https://github.com/NilFoundation/nil.js/commit/d93cd03062b75c94e33f3c85b2e24cc8088ac576) Thanks [@ukorvl](https://github.com/ukorvl)! - Remove peerDependencies and run npm audit

## 0.5.0

### Minor Changes

- [#59](https://github.com/NilFoundation/nil.js/pull/59) [`fd90707`](https://github.com/NilFoundation/nil.js/commit/fd9070739aa3b53c8f004209987de6ddbaf8a953) Thanks [@KlonD90](https://github.com/KlonD90)! - update wallet from nil + minter

## 0.4.0

### Minor Changes

- [#49](https://github.com/NilFoundation/nil.js/pull/49) [`dea3836`](https://github.com/NilFoundation/nil.js/commit/dea38368a50b5d658e198f5a68e66945981f7dcd) Thanks [@KlonD90](https://github.com/KlonD90)! - Add bounce, getCurrencies, waitTillCompleted

### Patch Changes

- [#46](https://github.com/NilFoundation/nil.js/pull/46) [`b07cf72`](https://github.com/NilFoundation/nil.js/commit/b07cf72e9fb96b7423118547ceeef942a2e1b15e) Thanks [@ukorvl](https://github.com/ukorvl)! - Make shardId optional when initializing public client

- [#39](https://github.com/NilFoundation/nil.js/pull/39) [`c6b8205`](https://github.com/NilFoundation/nil.js/commit/c6b82050d518417590ed7e95bc274f6523587d0a) Thanks [@ukorvl](https://github.com/ukorvl)! - Update biomejs and apply some code style rules

## 0.3.0

### Minor Changes

- [#38](https://github.com/NilFoundation/nil.js/pull/38) [`6e15a95`](https://github.com/NilFoundation/nil.js/commit/6e15a95a40f2168ffeccafc0dea2e94e90eab78e) Thanks [@KlonD90](https://github.com/KlonD90)! - New external message format add wallet

## 0.2.2

### Patch Changes

- [#33](https://github.com/NilFoundation/nil.js/pull/33) [`89a0e3c`](https://github.com/NilFoundation/nil.js/commit/89a0e3c4617fbb79dac29311dda526e1c09b3a37) Thanks [@KlonD90](https://github.com/KlonD90)! - fix export types

## 0.2.1

### Patch Changes

- [#30](https://github.com/NilFoundation/nil.js/pull/30) [`8578302`](https://github.com/NilFoundation/nil.js/commit/85783024fc6493d045c8474615349836c2df6497) Thanks [@KlonD90](https://github.com/KlonD90)! - fix circular deps

- [#23](https://github.com/NilFoundation/nil.js/pull/23) [`f27b10a`](https://github.com/NilFoundation/nil.js/commit/f27b10a8ef784731a4948de72ae7e4604b20e74d) Thanks [@ukorvl](https://github.com/ukorvl)! - Allow to pass shardId to public methods

- [#23](https://github.com/NilFoundation/nil.js/pull/23) [`f27b10a`](https://github.com/NilFoundation/nil.js/commit/f27b10a8ef784731a4948de72ae7e4604b20e74d) Thanks [@ukorvl](https://github.com/ukorvl)! - Fix all unit tests

## 0.2.0

### Minor Changes

- [#27](https://github.com/NilFoundation/nil.js/pull/27) [`8edcc59`](https://github.com/NilFoundation/nil.js/commit/8edcc5964335b6f53f3ebec2fd536841e26f0ce3) Thanks [@KlonD90](https://github.com/KlonD90)! - Remove hack that support fastssz sha256 zerohashes

## 0.1.4

### Patch Changes

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Fix package.sjon imports section

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Add internal field to the IMessage

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Add pollingInterval and timeout to client configs

- [#20](https://github.com/NilFoundation/nil.js/pull/20) [`373faae`](https://github.com/NilFoundation/nil.js/commit/373faaecd6f0972144d3258fade1682d86749f06) Thanks [@ukorvl](https://github.com/ukorvl)! - Add metamask transport

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Add mnemonic key

- [#17](https://github.com/NilFoundation/nil.js/pull/17) [`aec6f4f`](https://github.com/NilFoundation/nil.js/commit/aec6f4fe73011700724df16fa3e7567ca2e20f86) Thanks [@ukorvl](https://github.com/ukorvl)! - Add @lavamoat/allow-scripts package to run lifecycle scripts manually

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Remove provenance generation on publish cz now repository is private

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Add shardId property to clients

- [#21](https://github.com/NilFoundation/nil.js/pull/21) [`7438aa8`](https://github.com/NilFoundation/nil.js/commit/7438aa8edcd702fa71679d24aa7d6e90b4002c00) Thanks [@KlonD90](https://github.com/KlonD90)! - Remove all Buffer references cz it does not work in the browser

## 0.1.3

### Patch Changes

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Fix package.sjon imports section

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Add internal field to the IMessage

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Add pollingInterval and timeout to client configs

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Add mnemonic key

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Remove provenance generation on publish cz now repository is private

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Add shardId property to clients

- [#15](https://github.com/NilFoundation/nil.js/pull/15) [`10981f7`](https://github.com/NilFoundation/nil.js/commit/10981f7b2335847d93b71c900686e6625e818fa7) Thanks [@ukorvl](https://github.com/ukorvl)! - Remove all Buffer references cz it does not work in the browser

## 0.1.2

### Patch Changes

- [#13](https://github.com/NilFoundation/nil.js/pull/13) [`f47866e`](https://github.com/NilFoundation/nil.js/commit/f47866ebf12dff028f90283bf23158365a7a53f8) Thanks [@ukorvl](https://github.com/ukorvl)! - Enable ssz serialization

- [#11](https://github.com/NilFoundation/nil.js/pull/11) [`9b64379`](https://github.com/NilFoundation/nil.js/commit/9b643799c27f9014158fe612a169ee673c2640f1) Thanks [@ukorvl](https://github.com/ukorvl)! - Add unit tests for PublicClient

- [#10](https://github.com/NilFoundation/nil.js/pull/10) [`b512a6b`](https://github.com/NilFoundation/nil.js/commit/b512a6bb0c8ecfcd8bb4ead44e6241494402afb2) Thanks [@ukorvl](https://github.com/ukorvl)! - Add simple polling implementation, allow to run publish workflow only manually, extend walletClient from publicClient

- [#8](https://github.com/NilFoundation/nil.js/pull/8) [`8629ea1`](https://github.com/NilFoundation/nil.js/commit/8629ea139786c866f89907e46a828c32d61c76d9) Thanks [@ukorvl](https://github.com/ukorvl)! - Rename package because we are having an error: Package name too similar to existing package nil.js

- [#13](https://github.com/NilFoundation/nil.js/pull/13) [`f47866e`](https://github.com/NilFoundation/nil.js/commit/f47866ebf12dff028f90283bf23158365a7a53f8) Thanks [@ukorvl](https://github.com/ukorvl)! - Add WalletClient unit tests

## 0.1.1

### Patch Changes

- [#4](https://github.com/NilFoundation/nil.js/pull/4) [`a31443d`](https://github.com/NilFoundation/nil.js/commit/a31443d0fc7515f88b2cbd4ec1cf85a3dc97505c) Thanks [@ukorvl](https://github.com/ukorvl)! - Added methods to serialize messages and messages with signatures

- [#6](https://github.com/NilFoundation/nil.js/pull/6) [`45fd78a`](https://github.com/NilFoundation/nil.js/commit/45fd78a87b109e06b9195d8a44c26f43a1ae4801) Thanks [@ukorvl](https://github.com/ukorvl)! - Add commitlint config in typescript

- [#4](https://github.com/NilFoundation/nil.js/pull/4) [`a31443d`](https://github.com/NilFoundation/nil.js/commit/a31443d0fc7515f88b2cbd4ec1cf85a3dc97505c) Thanks [@ukorvl](https://github.com/ukorvl)! - Added ssz serialization schemas

- [#5](https://github.com/NilFoundation/nil.js/pull/5) [`c148332`](https://github.com/NilFoundation/nil.js/commit/c148332e951cfc970d0ccfe27552d15e7badf900) Thanks [@ukorvl](https://github.com/ukorvl)! - Rename transaction to message

- [#4](https://github.com/NilFoundation/nil.js/pull/4) [`a31443d`](https://github.com/NilFoundation/nil.js/commit/a31443d0fc7515f88b2cbd4ec1cf85a3dc97505c) Thanks [@ukorvl](https://github.com/ukorvl)! - Added index files inside feature directories to make root index with package exports clean

- [#6](https://github.com/NilFoundation/nil.js/pull/6) [`45fd78a`](https://github.com/NilFoundation/nil.js/commit/45fd78a87b109e06b9195d8a44c26f43a1ae4801) Thanks [@ukorvl](https://github.com/ukorvl)! - Add IReceipt and ILog interfaces

- [#5](https://github.com/NilFoundation/nil.js/pull/5) [`c148332`](https://github.com/NilFoundation/nil.js/commit/c148332e951cfc970d0ccfe27552d15e7badf900) Thanks [@ukorvl](https://github.com/ukorvl)! - Add cjs extension to commonjs build
