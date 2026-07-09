import { retryWithBackoff, createCircuitBreaker } from "@zuccadev-labs/barrits";

/**
 * [EN] Resilience pattern examples for Bun runtime.
 * Demonstrates retry with exponential backoff and circuit breaker.
 * [ES] Ejemplos de patrones de resiliencia para runtime Bun.
 */

/**
 * Example retry handler — simulates an operation that may transiently fail.
 */
let attemptCount = 0;
const flakyOperation = async () => {
  attemptCount++;
  if (attemptCount < 3) {
    throw new Error(`Transient failure on attempt ${attemptCount}`);
  }
  return "Operation succeeded after transient failures";
};

export const createResilienceExamples = async () => {
  // Reset counter for fresh run
  attemptCount = 0;

  const retryResult = await retryWithBackoff(flakyOperation, {
    maxRetries: 4,
    initialDelayMs: 10,
    backoffFactor: 1.5,
  });

  // Circuit breaker: protect against rapid failures
  const breaker = createCircuitBreaker({
    failureThreshold: 2,
    resetTimeoutMs: 100,
  });

  const breakerResults = [];
  // Two calls should trip the breaker
  for (let i = 0; i < 3; i++) {
    try {
      const result = await breaker.execute(async () => {
        throw new Error("Service unavailable");
      });
      breakerResults.push(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      breakerResults.push(`error: ${message}`);
    }
  }

  return {
    retry: retryResult,
    circuitBreaker: {
      results: breakerResults,
      state: breaker.state,
    },
  };
};
