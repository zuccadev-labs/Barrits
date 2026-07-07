---
name: barrits-runtime-quality
description: Enterprise cross-runtime quality assurance for the Barrits SDK: adapter validation, CI matrix management, example certification, and performance benchmarking across Node.js, Deno, and Bun.
---

# Barrits Runtime Quality

## When To Use

This specialist role is activated for quality assurance across runtimes:

- **Adapter validation**: Verify that Node.js, Deno, and Bun adapters produce equivalent behavior
- **CI matrix management**: Maintain CI configuration for multi-runtime testing
- **Example certification**: Ensure all cross-runtime examples build and run
- **Performance benchmarking**: Track execution time and memory across runtimes
- **Regression detection**: Catch runtime-specific regressions before release

## Quality Matrix

| Runtime | Core Tests | Examples | Bundler Plugins | CLI |
| :------ | :--------: | :------: | :-------------: | :-: |
| Node.js | ✅ 935 pass | ✅ example-nodejs | ✅ Vite, esbuild, Rollup, Webpack | ✅ |
| Deno | ✅ JSR compat | ✅ example-deno, deno-baas | ✅ Vite (via esbuild) | ✅ |
| Bun | ✅ npm compat | ✅ example-bun | ✅ Vite, esbuild | ✅ |

## Validation Workflow

### 1. Core Validation (All Runtimes)

```bash
# Node.js
cd packages/sdk/ts_js
npm run typecheck  # 0 errors
npm run build      # clean build
npm test           # 935+ passing, 0 failing

# Deno (integration tests)
cd examples/example-deno
deno task test

cd examples/example-deno-baas
deno task test

# Bun
cd examples/example-bun
bun run src/main.ts
```

### 2. Example Certification

Each example must pass its build/run validation:

```bash
for dir in packages/sdk/ts_js/examples/*/; do
  echo "=== $dir ==="
  cd "$dir"
  if [ -f "package.json" ]; then
    npm run build --if-present
  elif [ -f "deno.json" ]; then
    deno task start
  fi
done
```

### 3. Cross-Runtime Consistency

Verify structural output equivalence:

- Discovery manifests must produce the same shape (JSON schema)
- OpenAPI schema output must match across runtimes
- Trait composition must resolve identically
- Import generation must produce the same kinds

## CI/CD Integration

```yaml
# .github/workflows/quality.yml (reference)
jobs:
  node:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build && npm test

  deno:
    runs-on: ubuntu-latest
    steps:
      - uses: denoland/setup-deno@v2
      - run: deno task test --recursive

  bun:
    runs-on: ubuntu-latest
    steps:
      - uses: oven-sh/setup-bun@v2
      - run: bun install && bun run src/main.ts
```

## Performance Baselines

| Operation | Node.js | Deno | Bun |
| :-------- | :-----: | :--: | :-: |
| CLI `info` (cold) | ~800ms | ~900ms | ~400ms |
| Build manifest | ~150ms | ~200ms | ~100ms |
| Import generation | ~50ms | ~60ms | ~30ms |
| Trait composition | ~20ms | ~25ms | ~15ms |

## Acceptance Criteria

- [ ] All runtimes pass core tests
- [ ] All examples build and run without errors
- [ ] Structural output is consistent across runtimes
- [ ] CI matrix covers all three runtimes
- [ ] No runtime-specific regressions are introduced
- [ ] Performance baselines are tracked

## References

- Adapter source: `packages/sdk/ts_js/adapters/`
- Example directory: `packages/sdk/ts_js/examples/`
- CI workflows: `.github/workflows/`
- Validation skill: `docs/agents/skills/barrits-cross-runtime-validation/SKILL.md`
