import { sha256Hex, deterministicStringify, murmurHash3 } from "@zuccadev-labs/barrits";

export const createHashingExamples = () => {
  const hash = sha256Hex("test-data");
  const str = deterministicStringify({ a: 1, b: 2 });
  const mh = murmurHash3("hello");
  return { sha256Hex: hash, deterministicStringify: str, murmurHash3: mh };
};
