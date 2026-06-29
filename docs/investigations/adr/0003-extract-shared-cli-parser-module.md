# ADR 0003: Extract Shared CLI Parser Module from Duplicated Adapter Code

## Status
Accepted

## Context
The Barrits SDK provides two CLI adapters: `node/cli.ts` (668 lines) and `deno/cli.ts` (651 lines). These files shared ~157 lines of identical code including:
- Argument parsing logic (`parseArguments`)
- CLI option types (`CliOptions`, `CliCommand`, `IntegrationGraph`, `AutomationArtifactPaths`)
- Output formatting helpers (`printGraph`, `printImportActions`, `printInfoSummary`, `printCollisions`, `failOnCollisions`)
- Utility functions (`toSelectionFilters`, `hasCollisions`, `toGraphFingerprint`)
- File basename constants (`BUILD_MANIFEST_BASENAME`, etc.)

Any bug fix or enhancement to these functions required editing both files in parallel, creating a maintenance burden and risk of drift.

## Decision
Extract all shared CLI parsing, formatting, and type definitions into a new internal module `src/barrits/sdk/cli-parser.ts`. This module follows the same pattern as `cli-format.ts`:
- **Internal-only**: NOT exported from the SDK barrel (`index.ts`)
- **Adapter-specific logic stays**: Each adapter keeps its own `HELP_TEXT`, `runChildCommand`, `startWatchSession`, `ensureTextFile`, and `resolveAutomationArtifactPaths`
- **No runtime abstraction**: The module works for both Node.js and Deno without conditional runtime detection

## Consequences
### Positive
- Single source of truth for CLI parsing logic
- `node/cli.ts` reduced from 668 to 357 lines (-47%)
- `deno/cli.ts` reduced from 651 to 357 lines (-45%)
- Bug fixes now happen in one place
- New adapters (e.g., Bun CLI) can import the shared module directly

### Negative
- Added one new file to the project (261 lines)
- Internal module boundary requires awareness: not all CLI code belongs in the shared module
- Slightly more complex import graph (adapter → shared module → SDK internals)

## Implementation
1. Created `packages/sdk/ts_js/src/barrits/sdk/cli-parser.ts` with all shared exports
2. Updated `node/cli.ts` to import from `cli-parser.ts` and removed duplicated code
3. Updated `deno/cli.ts` to import from `cli-parser.ts` and removed duplicated code
4. Removed unused `isBarritsExportVisibility` and `isBarritsFileKind` imports from both CLI files

## Related Decisions
- ADR 0004: Split consume.ts into SRP modules (follows same extraction pattern)

## References
- `packages/sdk/ts_js/src/barrits/sdk/cli-parser.ts`
- `packages/sdk/ts_js/adapters/node/cli.ts`
- `packages/sdk/ts_js/adapters/deno/cli.ts`
