/**
 * @module
 * Hashing and integrity verification algorithms.
 *
 * This module provides both cryptographic and non-cryptographic hash functions
 * for use in build manifest sealing, content-addressable caching, and
 * distributed partition assignment.
 *
 * - `sha256Hex` — Cryptographic SHA-256 digest via Web Crypto API.
 * - `murmurHash3` — High-throughput non-cryptographic 32-bit hash.
 * - `deterministicStringify` — JSON serialization with lexicographic key ordering.
 */
/**
 * Cryptographic SHA-256 digest for integrity verification.
 */
export { sha256Hex } from "./sha256-hex";
/**
 * Non-cryptographic 32-bit hash for partitioning and indexing.
 */
export { murmurHash3 } from "./murmur-hash3";
/**
 * Deterministic JSON serializer with recursive key sorting.
 */
export { deterministicStringify } from "./deterministic-stringify";
/**
 * Aggregated hashing and integrity algorithm family.
 *
 * Provides a unified namespace for all hash-related operations used
 * across build pipelines, manifest sealing, and distributed systems.
 */
export declare const hashingAlgorithms: {
    /** Computes a SHA-256 hex digest of a UTF-8 string. */
    readonly sha256Hex: (input: string) => Promise<string>;
    /** Computes a 32-bit MurmurHash3 value for fast partitioning. */
    readonly murmurHash3: (input: string, seed?: number) => number;
    /** Serializes a value to a deterministic JSON string. */
    readonly deterministicStringify: (value: unknown, indent?: number) => string;
};
