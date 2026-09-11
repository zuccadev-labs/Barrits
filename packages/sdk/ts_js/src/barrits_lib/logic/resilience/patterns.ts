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
 * @throws The last encountered error if all retry attempts are exhausted or the error is not retryable.
 *
 * @example
 * ```ts
 * import { retryWithBackoff } from "@zuccadev-labs/barrits";
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
export const retryWithBackoff = async <T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
  const maxRetries = Math.max(0, options.maxRetries ?? 3);
  const initialDelayMs = options.initialDelayMs ?? 200;
  const backoffFactor = options.backoffFactor ?? 2;
  const maxDelayMs = options.maxDelayMs ?? 30_000;
  const isRetryable = options.isRetryable ?? (() => true);

  for (let attempt = 0; ; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      if (attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }

      const baseDelay = Math.min(initialDelayMs * Math.pow(backoffFactor, attempt), maxDelayMs);
      const jitter = baseDelay * (0.5 + Math.random() * 0.5);
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }
};

/**
 * Error rejected by `withTimeout` when the wrapped operation exceeds its deadline.
 * Detect it with `error instanceof TimeoutError` or `error.name === "TimeoutError"`.
 */
export class TimeoutError extends Error {
  /** Deadline that was exceeded, in milliseconds. */
  readonly timeoutMs: number;
  /** Label of the operation that timed out. */
  readonly label: string;

  /** Creates a timeout error for the given operation label and deadline. */
  constructor(label: string, timeoutMs: number) {
    super(`Timeout: "${label}" did not complete within ${timeoutMs}ms`);
    this.name = "TimeoutError";
    this.label = label;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Wraps an asynchronous operation with a timeout constraint.
 *
 * If the operation does not settle within the specified duration, the returned promise rejects with a
 * `TimeoutError`. The underlying operation keeps running but its result is discarded. The operation may be
 * passed as a promise or as a thunk (`() => Promise<T>`), matching `retryWithBackoff` and `CircuitBreaker.call`;
 * with a thunk the deadline starts when the thunk is invoked, i.e. inside this call.
 *
 * This function is essential for enforcing SLA deadlines at service boundaries, preventing unbounded waits
 * on unresponsive dependencies.
 *
 * @typeParam T - The return type of the operation.
 * @param operation - The asynchronous operation (promise or thunk) to constrain.
 * @param timeoutMs - Maximum allowed execution time in milliseconds.
 * @param label - Optional label included in the timeout error for diagnostics.
 * @returns A promise that resolves with the operation result or rejects with `TimeoutError`.
 *
 * @example
 * ```ts
 * import { withTimeout, TimeoutError } from "@zuccadev-labs/barrits";
 *
 * try {
 *   const result = await withTimeout(() => fetch("https://slow-api.example.com/data"), 5000, "slow-api fetch");
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     // handle the deadline
 *   }
 * }
 * ```
 */
export const withTimeout = <T>(operation: Promise<T> | (() => Promise<T>), timeoutMs: number, label = "operation"): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(label, timeoutMs));
    }, timeoutMs);

    const promise = typeof operation === "function" ? Promise.resolve().then(operation) : operation;

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
  });
};

/** Internal state representation of a circuit breaker instance. */
export type CircuitBreakerState = "closed" | "open" | "half-open";

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
 * Error rejected by a circuit breaker while its circuit is open.
 * Detect it with `error instanceof CircuitOpenError` or `error.name === "CircuitOpenError"`.
 */
export class CircuitOpenError extends Error {
  /** Creates the error with the standard open-circuit message. */
  constructor() {
    super("Circuit breaker is open. Request rejected.");
    this.name = "CircuitOpenError";
  }
}

/**
 * Creates a circuit breaker instance implementing the standard three-state
 * pattern (closed → open → half-open → closed).
 *
 * The circuit breaker pattern prevents cascading failures in distributed
 * systems by short-circuiting calls to a failing dependency. When the
 * failure count exceeds the threshold, the circuit opens and immediately
 * rejects subsequent calls with `CircuitOpenError` without executing the operation. After the
 * reset timeout elapses, the circuit enters a half-open state and allows
 * a limited number of test calls to determine whether the dependency
 * has recovered.
 *
 * @param options - Configuration for failure thresholds and timing.
 * @returns A `CircuitBreaker` object with `call`, `getState`, and `reset` methods.
 *
 * @example
 * ```ts
 * import { createCircuitBreaker } from "@zuccadev-labs/barrits";
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
        throw new CircuitOpenError();
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
