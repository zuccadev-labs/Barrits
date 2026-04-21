/**
 * @module
 * Resilience and fault-tolerance patterns for distributed systems.
 *
 * This module implements industry-standard reliability patterns used in
 * microservice architectures, cloud-native applications, and any system
 * where transient failures from network partitions, rate limiting, or
 * dependency outages must be handled gracefully.
 *
 * - `retryWithBackoff` — Exponential backoff retry with jitter and predicate filtering.
 * - `withTimeout` — Promise timeout wrapper for SLA enforcement.
 * - `createCircuitBreaker` — Three-state circuit breaker (closed/open/half-open).
 */
export { retryWithBackoff, withTimeout, createCircuitBreaker } from "./patterns";
export type { RetryOptions, CircuitBreakerOptions, CircuitBreaker } from "./patterns";
/**
 * Aggregated resilience pattern family.
 *
 * Provides a unified namespace for all fault-tolerance operations used
 * in service mesh orchestration and dependency management.
 */
export declare const resilienceAlgorithms: {
    /** Retries an async operation with exponential backoff and jitter. */
    readonly retryWithBackoff: <T>(operation: () => Promise<T>, options?: import("./patterns").RetryOptions) => Promise<T>;
    /** Wraps a promise with a timeout deadline. */
    readonly withTimeout: <T>(operation: Promise<T>, timeoutMs: number, label?: string) => Promise<T>;
    /** Creates a circuit breaker instance for dependency protection. */
    readonly createCircuitBreaker: (options?: import("./patterns").CircuitBreakerOptions) => import("./patterns").CircuitBreaker;
};
