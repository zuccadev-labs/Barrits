# ADR 0004: Split consume.ts into Single-Responsibility Modules

## Status
Accepted

## Context
The file `src/barrits/sdk/consume.ts` had grown to **757 lines** handling five distinct responsibilities:
1. **JSON validation** (~180 lines): `expect*` functions, constant sets, type guards
2. **Payload parsing** (~100 lines): `parseBuildManifestPayload`, `parseWatchSnapshotPayload`
3. **Diagnostic aggregation** (~120 lines): `createTraitDiagnosticAggregate`, `map*` helpers, empty-count factories
4. **Summary creation** (~200 lines): `createBuildManifestSummary`, `createWatchSnapshotSummary`, `createLanguageToolSnapshot`
5. **File reading** (~60 lines): `readBuildManifest`, `readWatchSnapshot`, etc.

This violated the Single Responsibility Principle: a change to validation logic required modifying the same file as a change to summary formatting, increasing cognitive load and merge conflict probability.

## Decision
Split `consume.ts` into three focused modules following the project's existing internal module pattern:

| Module | Lines | Responsibility |
|---|---|---|
| `validation.ts` | ~320 | JSON schema validation primitives (`expect*`, `withOptionalProperty`, sets/constants) |
| `summarization.ts` | ~198 | Diagnostic aggregation and compact summary creation (`create*Summary`, `createLanguageToolSnapshot`) |
| `consume.ts` | ~154 | Payload parsing and file reading (`parse*`, `read*`) |

All modules are imported by the SDK barrel (`index.ts`), which now sources the 3 summary functions from `./summarization` and the 7 parse/read functions from `./consume`.

## Consequences
### Positive
- Single Responsibility Principle restored: each module has exactly one reason to change
- Easier to test: validation, summarization, and parsing can be tested independently
- Reduced cognitive load: max 198 lines per module instead of 757
- No breaking changes to public API — all 10 exports preserved via barrel
- Established a reusable `validation.ts` that can be used by future parsing modules

### Negative
- Added 3 new files to the project (validation.ts, summarization.ts, summarization.d.ts)
- Updated 7 files for re-exports (index.ts, index.d.ts, consume.d.ts, `src/barrits/consume.ts`, `src/barrits/consume.d.ts`)
- Upstream importers (flat.ts, flat.d.ts) unchanged — they import from the package-level `consume.ts` which re-exports from the new locations

## Implementation
1. Extracted all `expect*` functions, sets, constants, and `withOptionalProperty` to `validation.ts`
2. Extracted `createTraitDiagnosticAggregate`, `map*`, `createEmpty*`, `withOptionalFilters`, and 3 summary creators to `summarization.ts`
3. Reduced `consume.ts` to keep only `parseBuildManifestPayload`, `parseWatchSnapshotPayload`, and 7 public parse/read functions
4. Updated `consume.d.ts` and created `summarization.d.ts` with handwritten declarations
5. Updated `index.ts` and `index.d.ts` barrel to import from both modules
6. Updated `src/barrits/consume.ts` and `.d.ts` to import summary functions from `./sdk/summarization`

## Related Decisions
- ADR 0003: Extract Shared CLI Parser Module (same extraction pattern for internal modules)
- `validation.ts` is internal-only (no barrel export), same as `cli-parser.ts` and `guards.ts`

## References
- `packages/sdk/ts_js/src/barrits/sdk/validation.ts`
- `packages/sdk/ts_js/src/barrits/sdk/summarization.ts`
- `packages/sdk/ts_js/src/barrits/sdk/consume.ts`
- `packages/sdk/ts_js/src/barrits/sdk/index.ts`
