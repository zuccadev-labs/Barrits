/**
 * Configuration for the `retryWithBackoff` function.
 */
export type RetryOptions = {
  /** Maximum retry attempts. Defaults to 3. */
  readonly maxRetries?: number;
  /** Initial delay in ms. Defaults to 200. */
  readonly initialDelayMs?: number;
  /** Backoff multiplier. Defaults to 2. */
  readonly backoffFactor?: number;
  /** Maximum delay cap in ms. Defaults to 30000. */
  readonly maxDelayMs?: number;
  /** Predicate to filter retryable errors. */
  readonly isRetryable?: (error: unknown) => boolean;
};

/**
 * Configuration for the `createCircuitBreaker` factory.
 */
export type CircuitBreakerOptions = {
  /** Consecutive failures before opening. Defaults to 5. */
  readonly failureThreshold?: number;
  /** Duration in ms the circuit stays open. Defaults to 30000. */
  readonly resetTimeoutMs?: number;
  /** Successful calls needed to close from half-open. Defaults to 1. */
  readonly successThreshold?: number;
};

/**
 * A circuit breaker instance.
 */
export type CircuitBreaker = {
  /** Executes an operation through the circuit breaker. */
  readonly call: <T>(operation: () => Promise<T>) => Promise<T>;
  /** Returns current state: "closed", "open", or "half-open". */
  readonly getState: () => "closed" | "open" | "half-open";
  /** Manually resets to closed state. */
  readonly reset: () => void;
};

/**
 * Retries an async operation with exponential backoff and jitter.
 * @typeParam T - Return type of the operation.
 * @param operation - The async function to retry.
 * @param options - Retry configuration.
 * @returns The operation result.
 */
export declare const retryWithBackoff: <T>(operation: () => Promise<T>, options?: RetryOptions) => Promise<T>;

/**
 * Wraps a promise with a timeout deadline.
 * @typeParam T - Return type of the operation.
 * @param operation - The promise to constrain.
 * @param timeoutMs - Maximum allowed time in ms.
 * @param label - Diagnostic label for timeout errors.
 * @returns The operation result or throws on timeout.
 */
export declare const withTimeout: <T>(operation: Promise<T>, timeoutMs: number, label?: string) => Promise<T>;

/**
 * Creates a circuit breaker with closed/open/half-open states.
 * @param options - Circuit breaker configuration.
 * @returns A CircuitBreaker instance.
 */
export declare const createCircuitBreaker: (options?: CircuitBreakerOptions) => CircuitBreaker;

/**
 * Aggregated resilience pattern family.
 */
export declare const resilienceAlgorithms: {
  readonly retryWithBackoff: typeof retryWithBackoff;
  readonly withTimeout: typeof withTimeout;
  readonly createCircuitBreaker: typeof createCircuitBreaker;
};
