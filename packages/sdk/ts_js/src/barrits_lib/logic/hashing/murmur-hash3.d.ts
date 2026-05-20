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
export declare const murmurHash3: (input: string, seed?: number) => number;
