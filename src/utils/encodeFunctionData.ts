import type { Abi } from "abitype";

type EncodeFunctionDataArgs = {
  abi: Abi;
  functionName: string;
  args?: unknown[];
};

const encodeFunctionData = ({
  abi,
  functionName,
  args,
}: EncodeFunctionDataArgs): Hex => {};

export { encodeFunctionData };
