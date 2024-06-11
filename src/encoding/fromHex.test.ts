import { hexToBigInt, hexToNumber } from "./fromHex.js";

test("hexToBigInt", () => {
  expect(hexToBigInt("0x7b")).toBe(123n);
  expect(hexToBigInt("7b")).toBe(123n);
});

test("hexToNumber", () => {
  expect(hexToNumber("0x7b")).toBe(123);
  expect(hexToNumber("7b")).toBe(123);
});
