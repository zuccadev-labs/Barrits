/**
 * Computes the SHA-256 hash of a UTF-8 string and returns it as a lowercase
 * hexadecimal digest. Uses the Web Crypto API for cross-runtime portability.
 *
 * @param input - The UTF-8 string to hash.
 * @returns A promise resolving to a 64-character lowercase hexadecimal string.
 */
export declare const sha256Hex: (input: string) => Promise<string>;

/**
 * Computes a 32-bit MurmurHash3 digest for hash-based partitioning.
 *
 * @param input - The string to hash.
 * @param seed - Optional 32-bit unsigned integer seed. Defaults to 0.
 * @returns A 32-bit unsigned integer hash value.
 */
export declare const murmurHash3: (input: string, seed?: number) => number;

/**
 * Produces a deterministic JSON string with recursively sorted object keys.
 *
 * @param value - The value to serialize.
 * @param indent - Optional indentation for human-readable output.
 * @returns A deterministic JSON string.
 */
export declare const deterministicStringify: (value: unknown, indent?: number) => string;

/**
 * Aggregated hashing and integrity algorithm family.
 */
export declare const hashingAlgorithms: {
  readonly sha256Hex: typeof sha256Hex;
  readonly murmurHash3: typeof murmurHash3;
  readonly deterministicStringify: typeof deterministicStringify;
};
