/**
 * Computes a 32-bit MurmurHash3 digest for the provided string input.
 *
 * MurmurHash3 is a non-cryptographic hash function designed for high
 * throughput and excellent distribution. It is widely adopted in distributed
 * systems for hash-based partitioning, consistent hashing rings, and
 * Bloom filters.
 *
 * Unlike SHA-256, MurmurHash3 is not suitable for security-critical
 * operations. Its primary advantage is speed: approximately 10x faster
 * than cryptographic alternatives for equivalent input sizes.
 *
 * @param input - The string to hash.
 * @param seed - Optional 32-bit unsigned integer seed. Defaults to 0.
 * @returns A 32-bit unsigned integer hash value.
 *
 * @example
 * ```ts
 * import { murmurHash3 } from "@aspect/barrits";
 *
 * const partitionKey = murmurHash3("user:12345") % 16;
 * // Assigns user to one of 16 partitions deterministically.
 * ```
 */
export const murmurHash3 = (input: string, seed: number = 0): number => {
  let h1 = seed >>> 0;
  const length = input.length;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let i = 0;

  while (i + 4 <= length) {
    let k1 =
      (input.charCodeAt(i) & 0xff) |
      ((input.charCodeAt(i + 1) & 0xff) << 8) |
      ((input.charCodeAt(i + 2) & 0xff) << 16) |
      ((input.charCodeAt(i + 3) & 0xff) << 24);

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

  if (remaining >= 3) k1 ^= (input.charCodeAt(i + 2) & 0xff) << 16;
  if (remaining >= 2) k1 ^= (input.charCodeAt(i + 1) & 0xff) << 8;
  if (remaining >= 1) {
    k1 ^= input.charCodeAt(i) & 0xff;
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
