import { toHex } from "./toHex.js";

test("should convert a string to hex", () => {
  expect(toHex("hello")).toBe("68656c6c6f");
});

test("should convert a number to hex", () => {
  expect(toHex(123)).toBe("7b");
});

test("should convert a bigint to hex", () => {
  expect(toHex(123n)).toBe("7b");
});

test("should convert a boolean to hex", () => {
  expect(toHex(true)).toBe("1");
  expect(toHex(false)).toBe("0");
});

test("should convert a Uint8Array to hex", () => {
  expect(toHex(new Uint8Array([1, 2, 3]))).toBe("010203");
});
