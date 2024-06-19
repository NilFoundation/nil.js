import { toHex } from "./toHex.js";

test("should convert a string to hex", () => {
  expect(toHex("hello")).toBe("0x68656c6c6f");
});

test("should convert a number to hex", () => {
  expect(toHex(123)).toBe("0x7b");
});

test("should convert a bigint to hex", () => {
  expect(toHex(123n)).toBe("0x7b");
});

test("should convert a boolean to hex", () => {
  expect(toHex(true)).toBe("0x1");
  expect(toHex(false)).toBe("0x0");
});

test("should convert a Uint8Array to hex", () => {
  expect(toHex(new Uint8Array([1, 2, 3]))).toBe("0x010203");
});
