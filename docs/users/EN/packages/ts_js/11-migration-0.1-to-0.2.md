# Migration Guide: 0.1.x → 0.2.x

## Overview

Version `0.2.0` expands the public API surface of `@zuccadev-labs/barrits` with 11 newly exposed functions across resilience, hashing, and datetime domains. It also introduces Bun runtime support, a fully populated `logic` convenience namespace, and a consolidated declaration output directory. No imports are removed, but consumers should review the following changes before upgrading.

**Migration effort level**: Low. No mandatory code changes for most consumers. Review sections 2 and 5 for edge cases.

---

## 1. New Flat Exports — Resilience, Hashing, Datetime

**Context**: The resilience (`retryWithBackoff`, `withTimeout`, `createCircuitBreaker`), hashing (`sha256Hex`, `murmurHash3`, `deterministicStringify`), and datetime (`toIsoString`, `fromIsoString`, `diffMs`, `addMs`, `toRelativeTime`) utilities were previously available only as internal modules. They are now fully re-exported through `@zuccadev-labs/barrits`.

**Impact**: Additive. Existing imports are unaffected.

```typescript
// 0.1.x — NOT available from the public entrypoint
// (required deep import into internal paths)

// 0.2.x — Available directly
import {
  retryWithBackoff,
  createCircuitBreaker,
  sha256Hex,
  murmurHash3,
  deterministicStringify,
  toIsoString,
  fromIsoString,
  diffMs,
  addMs,
  toRelativeTime,
} from "@zuccadev-labs/barrits";
```

**Migration**: No action required unless you want to replace deep internal imports with the public entrypoint.

---

## 2. `logic` Convenience Namespace — Now Complete

**Context**: The `logic` convenience object (accessible via `barrits.logic`, `brt.logic`, or `import { logic }`) was missing the 11 resilience/hashing/datetime functions. These are now included.

```typescript
// 0.1.x — logic.retryWithBackoff === undefined (missing)
// 0.2.x — logic.retryWithBackoff === [Function: retryWithBackoff]

import { logic } from "@zuccadev-labs/barrits";
logic.retryWithBackoff;   // ✅ Now defined
logic.sha256Hex;          // ✅ Now defined
logic.toIsoString;        // ✅ Now defined
```

**Impact**: Additive. `logic` now has 11 additional properties. If your code iterates over `Object.keys(logic)` or spreads the object, the output will include these new entries. This is unlikely to cause issues, but should be reviewed if you serialize, compare, or snapshot the `logic` object.

---

## 3. Bun Runtime Support

**Context**: `BarritsRuntimeKind` now includes `"bun"`. A new subpath `@zuccadev-labs/barrits/bun` provides a Bun-specific adapter.

```typescript
// 0.2.x — New subpath import
import { runBunCli } from "@zuccadev-labs/barrits/bun";
```

**Impact**: Additive. No migration required unless you use strict runtime-kind validation and want to allow `"bun"`.

---

## 4. Async `createOperationalShowcase` (Example-Bun Only)

**Context**: The `createOperationalShowcase` function used in `example-bun` examples is declared `async` to support `createResilienceExamples`. This is not part of the core SDK public surface.

**Impact**: If you copied or referenced this function from the bun examples, ensure calls use `await`.

```typescript
// If you imported or replicated this pattern:
// 0.1.x (if existed) — const result = createOperationalShowcase();
// 0.2.x — const result = await createOperationalShowcase();
```

---

## 5. Declaration Output Directory

**Context**: The `tsconfig.json` `declarationDir` has been changed to `"dist"`. Previously, type declarations (`.d.ts`) were generated adjacent to source files in `src/` and `adapters/`. They now reside in `dist/`.

**Impact**: Potentially breaking — **only if** your toolchain or IDE relies on `.d.ts` files located inside `src/` or `adapters/`. This can affect:

- TypeDoc or API extractor configurations pointing to `src/**/*.d.ts`
- Monorepo workspace references that resolve types from source directories
- Custom type generation pipelines

**Migration**:

```jsonc
// If you reference .d.ts paths directly, update to dist/:
// Before: "packages/sdk/ts_js/src/**/*.d.ts"
// After:  "packages/sdk/ts_js/dist/**/*.d.ts"
```

You can verify type resolution by running:

```bash
npx tsc --noEmit --project packages/sdk/ts_js/tsconfig.json
```

If you encounter no errors, your toolchain is already compatible.

---

## 6. Deprecations and Removals

**Nothing is removed or deprecated in 0.2.0.** All previously available exports remain available. The changes are strictly additive or structural.

---

## Summary of Changes

| Area | Change | Type |
|------|--------|------|
| Flat exports (resilience, hashing, datetime) | 11 new functions available from `@zuccadev-labs/barrits` | 🟢 Additive |
| `logic` namespace | 11 missing functions added to `logic` object | 🟢 Additive |
| Bun runtime | New `BarritsRuntimeKind` variant + `@zuccadev-labs/barrits/bun` subpath | 🟢 Additive |
| `createOperationalShowcase` | Marked `async` (example-bun only) | 🟡 Informational |
| `declarationDir` | Changed to `"dist"` | 🟡 Check if your toolchain references `src/**/*.d.ts` |

## Rollback

To revert to `0.1.x`:

```bash
npm install @zuccadev-labs/barrits@0.1.9
```

No data migration or state changes are involved — this is a stateless library.
