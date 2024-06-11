import { accounts } from "../../test/mocks/accounts.js";
import { prepareDeployData } from "./deployData.js";

test("prepareDeployData", () => {
  const deployData = {
    bytecode: "0x7b",
    shardId: 1,
  };

  const preparedDeployData = prepareDeployData(deployData);

  expect(preparedDeployData).toBeDefined();
});

test("prepareDeployData with seqno", () => {
  const deployData = {
    bytecode: "0x7b",
    shardId: 1,
    seqno: 1,
  };

  const preparedDeployData = prepareDeployData(deployData);

  expect(preparedDeployData).toBeDefined();
});

test("prepareDeployData with pubkey", () => {
  const deployData = {
    bytecode: "0x7b",
    shardId: 1,
    pubkey: accounts[0].publicKey,
  };

  const preparedDeployData = prepareDeployData(deployData);

  expect(preparedDeployData).toBeDefined();
});
