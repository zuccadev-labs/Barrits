---
name: barrits-automation-showcase
description: Live demonstrations of Barrits SDK features across all runtimes. Use when running or explaining the discovery pipeline, import generation, manifest creation, trait composition, and cross-runtime CLI capabilities.
---

# Barrits Automation Showcase

## When To Use

Apply this skill when you need to demonstrate or validate any of these Barrits SDK automation capabilities:

- Discovery and inspection pipeline with domain/export/file-kind/visibility filters
- Import action generation with named, namespace, and alias-namespace imports
- Build manifest generation with SHA-256 cryptographic integrity
- Trait composition and conflict resolution mechanics
- Cross-runtime CLI output comparison (Node.js, Deno, Bun)

## Workflow

### 1. Discovery & Inspection

```bash
cd packages/sdk/ts_js

# Basic integration graph
npx tsx adapters/node/cli.ts info

# Structured JSON output
npx tsx adapters/node/cli.ts info --json

# Filtered queries
npx tsx adapters/node/cli.ts info --domain <name>
npx tsx adapters/node/cli.ts info --export <name>
npx tsx adapters/node/cli.ts info --kind function
npx tsx adapters/node/cli.ts info --visibility public
```

Explain: domains, exports, trait descriptors, diagnostics, and how filters compose.

### 2. Import Generation

```bash
cd packages/sdk/ts_js

# Generate import statements
npx tsx adapters/node/cli.ts imports
```

Explain: named-import, namespace-access, alias-namespace-access, and how the AST crawler discovers import patterns.

### 3. Build Manifest

```bash
cd packages/sdk/ts_js

# Generate manifest
npx tsx adapters/node/cli.ts build

# Inspect output
cat .barrits/manifest.json
```

Explain: checksum (SHA-256 via `deterministicStringify`), `generatedAt` timestamp, projected imports, and byte-for-byte reproducibility across OS.

### 4. Trait Composition

```bash
cd packages/sdk/ts_js/examples/example-nodejs
# Inspect trait descriptors
cat barrits/traits/*.ts
```

Explain: `createTraitDescriptor`, `@barrits-provides` / `@barrits-consumes` JSDoc annotations, `composePipeline`, and `mergeTraits` conflict resolution.

### 5. Cross-Runtime Comparison

```bash
# Node.js
cd packages/sdk/ts_js && npx tsx adapters/node/cli.ts info

# Deno
cd packages/sdk/ts_js/examples/example-deno && deno run -A ../../adapters/deno/cli.ts info

# Bun
cd packages/sdk/ts_js/examples/example-bun && bun run src/main.ts
```

Compare: output structure, performance characteristics, and runtime-specific adapter behavior.

## Acceptance Criteria

- [ ] Each showcase step produces expected output without errors
- [ ] Filters correctly narrow discovery results
- [ ] Import generation produces all three import kinds
- [ ] Build manifest has valid `checksum` and `generatedAt` fields
- [ ] Trait composition merges correctly with conflict resolution
- [ ] Cross-runtime outputs are structurally equivalent

## References

- Node CLI: `packages/sdk/ts_js/adapters/node/cli.ts`
- Deno CLI: `packages/sdk/ts_js/adapters/deno/cli.ts`
- Examples directory: `packages/sdk/ts_js/examples/`
- `.opencode/skills/automation-showcase/skill.jsonc`
