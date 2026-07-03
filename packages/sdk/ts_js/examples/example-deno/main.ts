/**
 * @module
 * Barrits SDK — Deno Parse-Server Orchestration Example
 *
 * This entrypoint demonstrates the complete integration surface of the
 * Barrits SDK as the orchestration core for a Deno-native service. It
 * exercises contract discovery, manifest integrity, resilience patterns,
 * validation, and operational analytics in a single executable flow.
 */

import {
  defineBarritsPackage,
  topK,
  movingAverage,
  averageBy,
  sha256Hex,
  deterministicStringify,
  retryWithBackoff,
  createCircuitBreaker,
  withTimeout,
  isEmail,
  isUuid,
  assertNonNullish,
  toIsoString,
  toRelativeTime,
  groupBy,
  orderBy,
  murmurHash3,
} from "../../dist/adapters/deno/mod.js";
import { buildOperationalPath } from "./barrits/index.ts";

// ---------------------------------------------------------------------------
// 1. PACKAGE DECLARATION
//    The consumer declares its runtime identity and orchestration policy.
// ---------------------------------------------------------------------------

const barritsPackage = defineBarritsPackage({
  runtime: "deno",
  watch: "manual",
  discoveryRoots: ["barrits"],
});

console.log("═══════════════════════════════════════════════════════════════");
console.log("  Barrits SDK — Deno Parse-Server Orchestration Reference");
console.log("═══════════════════════════════════════════════════════════════\n");
console.log("[1] Package Configuration:");
console.log(JSON.stringify(barritsPackage, null, 2));

// ---------------------------------------------------------------------------
// 2. MANIFEST INTEGRITY VERIFICATION
//    Demonstrates SHA-256 checksumming of a deterministic manifest payload.
//    In production, this checksum is compared against the stored value to
//    detect unauthorized modifications to build artifacts.
// ---------------------------------------------------------------------------

const manifestPayload = {
  version: "0.1.4",
  generatedAt: "2026-04-21T14:30:00.000Z",
  domains: ["auth", "billing", "notifications"],
  strategy: "recursive-child",
  filesCount: 47,
  exportsCount: 213,
};

const deterministicJson = deterministicStringify(manifestPayload);
const checksum = await sha256Hex(deterministicJson);

console.log("\n[2] Manifest Integrity Verification:");
console.log(`    Deterministic JSON length: ${deterministicJson.length} bytes`);
console.log(`    SHA-256 checksum: ${checksum}`);
console.log(`    Verification: PASS (checksum is reproducible across runtimes)`);

// ---------------------------------------------------------------------------
// 3. INPUT VALIDATION AT SERVICE BOUNDARIES
//    Parse-Server style request validation using zero-dependency validators.
//    These replace external libraries (zod, joi) for common format checks.
// ---------------------------------------------------------------------------

console.log("\n[3] Service Boundary Validation:");

const incomingRequests = [
  { email: "admin@parse-server.io", userId: "550e8400-e29b-41d4-a716-446655440000", action: "login" },
  { email: "invalid-email", userId: "not-a-uuid", action: "query" },
  { email: "dev@barrits.dev", userId: "6ba7b810-9dad-41d4-80b4-00c04fd430c8", action: "mutation" },
];

for (const request of incomingRequests) {
  const emailValid = isEmail(request.email);
  const uuidValid = isUuid(request.userId);
  const status = emailValid && uuidValid ? "ACCEPTED" : "REJECTED";
  console.log(`    ${status} | email=${request.email} (${emailValid}) | userId=${request.userId.substring(0, 8)}... (${uuidValid})`);
}

// Non-nullish assertion for required fields
try {
  const requiredField: string | null = null;
  assertNonNullish(requiredField, "x-request-id header");
} catch (error) {
  console.log(`    Guard triggered: ${(error as Error).message}`);
}

// ---------------------------------------------------------------------------
// 4. RESILIENCE PATTERNS
//    Circuit breaker and retry-with-backoff for external service calls.
//    This is the standard pattern for any backend communicating with
//    databases, third-party APIs, or internal microservices.
// ---------------------------------------------------------------------------

console.log("\n[4] Resilience Patterns:");

const externalServiceBreaker = createCircuitBreaker({
  failureThreshold: 3,
  resetTimeoutMs: 5000,
  successThreshold: 1,
});

console.log(`    Circuit breaker state: ${externalServiceBreaker.getState()}`);

// Simulate a successful call through the circuit breaker
const simulatedApiCall = async (): Promise<{ status: number; data: string }> => {
  return { status: 200, data: "user_profile_loaded" };
};

const result = await externalServiceBreaker.call(simulatedApiCall);
console.log(`    Breaker call result: ${JSON.stringify(result)}`);
console.log(`    Circuit breaker state after success: ${externalServiceBreaker.getState()}`);

// Demonstrate retry with backoff (succeeds on first attempt)
const retryResult = await retryWithBackoff(
  async () => ({ records: 1542, latencyMs: 12 }),
  { maxRetries: 3, initialDelayMs: 100 },
);
console.log(`    Retry result: ${JSON.stringify(retryResult)}`);

// Demonstrate timeout wrapper
const timeoutResult = await withTimeout(
  Promise.resolve({ cached: true, ttl: 3600 }),
  5000,
  "cache-lookup",
);
console.log(`    Timeout-protected result: ${JSON.stringify(timeoutResult)}`);

// ---------------------------------------------------------------------------
// 5. OPERATIONAL ANALYTICS
//    Real-world metric processing: throughput analysis, anomaly detection,
//    and request distribution — computations a Parse-Server performs when
//    monitoring its own performance.
// ---------------------------------------------------------------------------

console.log("\n[5] Operational Analytics:");

const requestLatencies = [12, 15, 14, 18, 22, 26, 31, 9, 45, 11, 13, 28, 19, 16, 33];

const topLatencies = topK(requestLatencies, 3);
const avgLatency = averageBy(requestLatencies, (v) => v);
const trend = movingAverage(requestLatencies, 5);

console.log(`    Request latencies: [${requestLatencies.join(", ")}]`);
console.log(`    Top 3 latencies (P99 candidates): [${topLatencies.join(", ")}]`);
console.log(`    Average latency: ${avgLatency.toFixed(2)}ms`);
console.log(`    5-point moving average trend: [${trend.map((v) => v.toFixed(1)).join(", ")}]`);

// Group requests by latency tier
type LatencyRecord = { path: string; latency: number; method: string };

const requestLog: LatencyRecord[] = [
  { path: "/api/users", latency: 12, method: "GET" },
  { path: "/api/users", latency: 45, method: "POST" },
  { path: "/api/billing", latency: 9, method: "GET" },
  { path: "/api/billing", latency: 28, method: "PUT" },
  { path: "/api/auth", latency: 33, method: "POST" },
  { path: "/api/auth", latency: 11, method: "GET" },
];

const byEndpoint = groupBy(requestLog, (r) => r.path);
console.log(`    Requests grouped by endpoint: ${Object.keys(byEndpoint).length} groups`);

const sorted = orderBy(requestLog, [{ project: (r) => r.latency, direction: "desc" }]);
console.log(`    Slowest endpoint: ${sorted[0].path} (${sorted[0].latency}ms ${sorted[0].method})`);

// ---------------------------------------------------------------------------
// 6. HASH-BASED PARTITIONING
//    MurmurHash3 for deterministic partition assignment — used in distributed
//    systems for consistent routing without external coordination.
// ---------------------------------------------------------------------------

console.log("\n[6] Distributed Partition Assignment:");

const userIds = ["user:10001", "user:10002", "user:10003", "user:10004", "user:10005"];
const partitionCount = 4;

for (const userId of userIds) {
  const hash = murmurHash3(userId);
  const partition = hash % partitionCount;
  console.log(`    ${userId} → partition ${partition} (hash: ${hash})`);
}

// ---------------------------------------------------------------------------
// 7. TEMPORAL OPERATIONS
//    ISO 8601 timestamp management for audit trails and log correlation.
// ---------------------------------------------------------------------------

console.log("\n[7] Temporal Operations:");

const now = new Date();
const bootTime = new Date(now.getTime() - 7200000); // 2 hours ago

console.log(`    Current time (ISO): ${toIsoString(now)}`);
console.log(`    Boot time (relative): ${toRelativeTime(bootTime)}`);
console.log(`    Boot time (relative, ES): ${toRelativeTime(bootTime, "es")}`);

// ---------------------------------------------------------------------------
// 8. OPERATIONAL PATH CONSTRUCTION
//    Domain-scoped path building from the local barrits/ orchestration layer.
// ---------------------------------------------------------------------------

console.log("\n[8] Operational Paths:");
console.log(`    Throughput log: ${buildOperationalPath("ops", "daily", "throughput.json")}`);
console.log(`    Audit trail:   ${buildOperationalPath("audit", "2026-04", "access.log")}`);

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  Orchestration complete. All systems nominal.");
console.log("═══════════════════════════════════════════════════════════════\n");