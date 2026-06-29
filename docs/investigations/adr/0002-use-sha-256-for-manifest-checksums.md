# ADR 0002: Use SHA-256 Instead of FNV-1a for Build Manifest Checksums

## Status
Accepted

## Context
The Barrits SDK generates a `BarritsBuildManifest` that includes a `checksum` field intended to guarantee supply chain integrity. The original implementation used the **FNV-1a** non-cryptographic 32-bit hash algorithm, but misleadingly labeled the output with the prefix `sha256-barrits-`. This created a false sense of security — FNV-1a is designed for hash tables, not cryptographic integrity, and can be collided intentionally in under 2^32 attempts.

The `checksum` field is consumed by downstream language tools and CI pipelines to detect structural degeneration of code (trait renames, missing exports, domain changes).

## Decision
Replace FNV-1a with **SHA-256** via the Web Crypto API (`crypto.subtle.digest("SHA-256", ...)`). Key requirements:
1. The hash must be **cryptographically secure** (pre-image resistant, collision resistant)
2. The implementation must work across **Node.js 18+, Deno, Bun, and browsers**
3. The prefix must remain `sha256-barrits-` to clearly identify the algorithm

Web Crypto API was chosen over Node-specific `crypto.createHash()` because it is a cross-platform standard available in all target runtimes.

## Consequences
### Positive
- Real cryptographic integrity with SHA-256 (128-bit collision resistance)
- Cross-platform: works on Node.js 18+, Deno, Bun, and browsers without conditional imports
- The prefix `sha256-barrits-` is now honest and accurate
- No breaking changes to the manifest schema (field name and prefix unchanged)

### Negative
- **Breaking API change**: `createBuildManifest`, `stringifyBuildManifest`, and the internal `generateChecksum` became `async` (return `Promise`) because Web Crypto API is asynchronous
- Slightly higher CPU cost than FNV-1a (irrelevant for build-time usage)

## Implementation
1. Rewrote `generateChecksum` in `manifest.ts:39-46` to use `crypto.subtle.digest("SHA-256", ...)` with `TextEncoder`
2. Added `async` to `generateChecksum`, `createBuildManifest`, and `stringifyBuildManifest`
3. Updated `manifest.d.ts` return types to `Promise<BarritsBuildManifest>` / `Promise<string>`
4. Updated all callers in `node/cli.ts`, `deno/cli.ts`, `plugins/shared.ts`, and `tests/automation-e2e.test.ts` to `await` the async functions
5. Prefix `sha256-barrits-` preserved to maintain backward compatibility with any parser that checks the prefix

## Related Decisions
- ADR 0001: Conventional Commits and Lint-Staged

## References
- [MDN: crypto.subtle.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [FNV-1a specification](http://www.isthe.com/chongo/tech/comp/fnv/)
- `packages/sdk/ts_js/src/barrits/sdk/manifest.ts` (implementation)
