import { sha256Hex, deterministicStringify, murmurHash3 } from "@zuccadev-labs/barrits";

/**
 * [EN] Hashing and integrity examples for Bun runtime.
 * Demonstrates SHA-256, MurmurHash3, and deterministic JSON stringification.
 * [ES] Ejemplos de hashing e integridad para runtime Bun.
 */

export const createHashingExamples = () => {
  const payload = { b: 2, a: 1, c: [3, 1, 2] };
  const deterministic = deterministicStringify(payload);

  return {
    sha256Hex: sha256Hex("hello, barrits on Bun"),
    deterministicStringify: deterministic,
    murmurHash3: murmurHash3(deterministic),
  };
};
