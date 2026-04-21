/**
 * Configuration options for the `retryWithBackoff` function.
 */
export type RetryOptions = {
  /** Maximum number of retry attempts before failing. Defaults to 3. */
  readonly maxRetries?: number;
  /** Initial delay in milliseconds before the first retry. Defaults to 200. */
  readonly initialDelayMs?: number;
  /** Multiplicative factor applied to the delay after each retry. Defaults to 2. */
  readonly backoffFactor?: number;
  /** Maximum delay cap in milliseconds to prevent unbounded waits. Defaults to 30000. */
  readonly maxDelayMs?: number;
  /** Optional predicate to determine whether a given error is retryable. When
   * omitted, all errors are retried. */
  readonly isRetryable?: (error: unknown) => boolean;
};

/**
 * Executes an asynchronous operation with exponential backoff retry logic.
 *
 * This function is designed for transient failure recovery in distributed
 * systems. It retries the provided operation up to `maxRetries` times,
 * with an exponentially increasing delay between attempts. A jitter factor
 * is applied to prevent thundering-herd effects in multi-instance deployments.
 *
 * The `isRetryable` predicate allows callers to distinguish between
 * transient errors (network timeouts, rate limits) and permanent failures
 * (validation errors, authentication failures) that should not be retried.
 *
 * @typeParam T - The return type of the operation.
 * @param operation - The asynchronous function to execute and potentially retry.
 * @param options - Configuration for retry behavior.
 * @returns A promise resolving to the operation result.
 * @throws The last encountered error if all retry attempts are exhausted.
 *
 * @example
 * ```ts
 * import { retryWithBackoff } from "@aspect/barrits";
 *
 * const data = await retryWithBackoff(
 *   () => fetch("https://api.example.com/data").then(r => r.json()),
 *   {
 *     maxRetries: 5,
 *     initialDelayMs: 500,
 *     isRetryable: (err) => err instanceof TypeError, // network errors only
 *   },
 * );
 * ```
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> => {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 200;
  const backoffFactor = options.backoffFactor ?? 2;
  const maxDelayMs = options.maxDelayMs ?? 30_000;
  const isRetryable = options.isRetryable ?? (() => true);

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;

      if (attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }

      const baseDelay = Math.min(initialDelayMs * Math.pow(backoffFactor, attempt), maxDelayMs);
      const jitter = baseDelay * (0.5 + Math.random() * 0.5);
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  throw lastError;
};

/**
 * Wraps an asynchronous operation with a timeout constraint.
 *
 * If the operation does not resolve within the specified duration,
 * the returned promise rejects with a `TimeoutError`. The underlying
 * operation continues executing but its result is discarded.
 *
 * This function is essential for enforcing SLA deadlines at service
 * boundaries, preventing unbounded waits on unresponsive dependencies.
 *
 * @typeParam T - The return type of the operation.
 * @param operation - The asynchronous operation to constrain.
 * @param timeoutMs - Maximum allowed execution time in milliseconds.
 * @param label - Optional label included in the timeout error for diagnostics.
 * @returns A promise that resolves with the operation result or rejects on timeout.
 *
 * @example
 * ```ts
 * import { withTimeout } from "@aspect/barrits";
 *
 * const result = await withTimeout(
 *   fetch("https://slow-api.example.com/data"),
 *   5000,
 *   "slow-api fetch",
 * );
 * ```
 */
export const withTimeout = <T>(
  operation: Promise<T>,
  timeoutMs: number,
  label: string = "operation",
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout: "${label}" did not complete within ${timeoutMs}ms`));
    }, timeoutMs);

    operation
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

/** Internal state representation of a circuit breaker instance. */
type CircuitBreakerState = "closed" | "open" | "half-open";

/**
 * Configuration options for the `createCircuitBreaker` factory.
 */
export type CircuitBreakerOptions = {
  /** Number of consecutive failures before the circuit opens. Defaults to 5. */
  readonly failureThreshold?: number;
  /** Duration in milliseconds the circuit remains open before testing recovery. Defaults to 30000. */
  readonly resetTimeoutMs?: number;
  /** Number of successful calls in half-open state before closing the circuit. Defaults to 1. */
  readonly successThreshold?: number;
};

/**
 * A circuit breaker instance returned by `createCircuitBreaker`.
 */
export type CircuitBreaker = {
  /** Executes an operation through the circuit breaker. */
  readonly call: <T>(operation: () => Promise<T>) => Promise<T>;
  /** Returns the current state of the circuit. */
  readonly getState: () => CircuitBreakerState;
  /** Manually resets the circuit to the closed state. */
  readonly reset: () => void;
};

/**
 * Creates a circuit breaker instance implementing the standard three-state
 * pattern (closed → open → half-open → closed).
 *
 * The circuit breaker pattern prevents cascading failures in distributed
 * systems by short-circuiting calls to a failing dependency. When the
 * failure count exceeds the threshold, the circuit opens and immediately
 * rejects subsequent calls without executing the operation. After the
 * reset timeout elapses, the circuit enters a half-open state and allows
 * a limited number of test calls to determine whether the dependency
 * has recovered.
 *
 * @param options - Configuration for failure thresholds and timing.
 * @returns A `CircuitBreaker` object with `call`, `getState`, and `reset` methods.
 *
 * @example
 * ```ts
 * import { createCircuitBreaker } from "@aspect/barrits";
 *
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 3,
 *   resetTimeoutMs: 10000,
 * });
 *
 * // Normal usage — calls pass through while circuit is closed.
 * const data = await breaker.call(() => fetch("/api/data").then(r => r.json()));
 *
 * // After 3 consecutive failures, circuit opens and rejects immediately.
 * breaker.getState(); // "open"
 * ```
 */
export const createCircuitBreaker = (options: CircuitBreakerOptions = {}): CircuitBreaker => {
  const failureThreshold = options.failureThreshold ?? 5;
  const resetTimeoutMs = options.resetTimeoutMs ?? 30_000;
  const successThreshold = options.successThreshold ?? 1;

  let state: CircuitBreakerState = "closed";
  let failureCount = 0;
  let successCount = 0;
  let lastFailureTime = 0;

  const call = async <T>(operation: () => Promise<T>): Promise<T> => {
    if (state === "open") {
      if (Date.now() - lastFailureTime >= resetTimeoutMs) {
        state = "half-open";
        successCount = 0;
      } else {
        throw new Error("Circuit breaker is open. Request rejected.");
      }
    }

    try {
      const result = await operation();

      if (state === "half-open") {
        successCount++;
        if (successCount >= successThreshold) {
          state = "closed";
          failureCount = 0;
        }
      } else {
        failureCount = 0;
      }

      return result;
    } catch (error) {
      failureCount++;
      lastFailureTime = Date.now();

      if (failureCount >= failureThreshold) {
        state = "open";
      }

      throw error;
    }
  };

  const getState = (): CircuitBreakerState => state;

  const reset = (): void => {
    state = "closed";
    failureCount = 0;
    successCount = 0;
    lastFailureTime = 0;
  };

  return { call, getState, reset };
};
