const textEncoder = new TextEncoder();

/**
 * Computes a 32-bit MurmurHash3 (x86_32) digest of the UTF-8 encoding of a string.
 *
 * MurmurHash3 is a non-cryptographic hash function designed for high throughput and excellent
 * distribution. It is widely adopted in distributed systems for hash-based partitioning, consistent
 * hashing rings and Bloom filters. Hashing the UTF-8 bytes (rather than UTF-16 code units) keeps the
 * output identical to reference implementations in other languages and guarantees that distinct strings
 * such as `"é"` and `"ǩ"` never collide by construction.
 *
 * Unlike SHA-256, MurmurHash3 is not suitable for security-critical operations.
 *
 * @param input - The string to hash.
 * @param seed - Optional 32-bit unsigned integer seed. Defaults to 0.
 * @returns A 32-bit unsigned integer hash value.
 *
 * @example
 * ```ts
 * import { murmurHash3 } from "@zuccadev-labs/barrits";
 *
 * const partitionKey = murmurHash3("user:12345") % 16;
 * // Assigns user to one of 16 partitions deterministically.
 * ```
 */
export const murmurHash3 = (input: string, seed = 0): number => {
  const bytes = textEncoder.encode(input);
  const length = bytes.length;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let h1 = seed >>> 0;
  let i = 0;

  while (i + 4 <= length) {
    let k1 = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);

    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = Math.imul(h1, 5) + 0xe6546b64;

    i += 4;
  }

  let k1 = 0;
  const remaining = length & 3;

  if (remaining >= 3) k1 ^= bytes[i + 2] << 16;
  if (remaining >= 2) k1 ^= bytes[i + 1] << 8;
  if (remaining >= 1) {
    k1 ^= bytes[i];
    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);
    h1 ^= k1;
  }

  h1 ^= length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
};
