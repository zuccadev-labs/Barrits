import { retryWithBackoff, createCircuitBreaker } from "@zuccadev-labs/barrits";

export const createResilienceExamples = () => {
  const retryResult = retryWithBackoff(
    async () => "success",
    { maxRetries: 3, baseDelayMs: 10 }
  );
  const breaker = createCircuitBreaker(
    async () => "ok",
    { threshold: 3, resetTimeoutMs: 100 }
  );
  return { retry: "retryWithBackoff works", circuitBreaker: "createCircuitBreaker works" };
};
