/**
 * Converts bytes to a string.
 * @param bytes - The bytes to convert to a string.
 * @returns The string representation of the input.
 */
const bytesToString = (bytes: Uint8Array): string => {
  const decoder = new TextDecoder("utf8");
  const str = decoder.decode(bytes);

  return str;
};

export { bytesToString };
