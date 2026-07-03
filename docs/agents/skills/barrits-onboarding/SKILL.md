---
name: barrits-onboarding
description: Use this skill when onboarding new developers to the Barrits SDK. Provides setup instructions, architecture overview, development workflow, and contribution guidelines.
---

# Barrits Onboarding

## Prerequisites
- Node.js >= 18 (v22 recommended)
- npm >= 11
- Deno >= 2.x
- Bun >= 1.3 (optional)
- Git

## Setup

```bash
git clone <repo-url>
cd barrits
npm install
npm run build
npm test
```

## Repository Structure

```
barrits/
├── packages/sdk/ts_js/     # Core SDK (TypeScript)
│   ├── src/barrits/        # Runtime source
│   │   ├── sdk/            # Core: discovery, inspect, manifest
│   │   ├── config/         # Config loading & resolution
│   │   ├── plugins/        # Vite, esbuild, rollup, webpack
│   │   ├── traits/         # IoC & trait composition
│   │   └── api/            # Public API surface
│   ├── adapters/           # Node.js & Deno entry points
│   ├── tests/              # Test suite (935+ tests)
│   └── examples/           # Cross-runtime examples
├── .github/workflows/      # CI/CD pipelines
└── docs/                   # Documentation
```

## Development Workflow

1. Branch from `dev`
2. Run `npm run typecheck` after changes
3. Run `npm test` before commit (pre-commit hook)
4. Keep tests passing: 935+ tests, 0 failures
5. ESLint: 0 errors, 0 warnings on `src/barrits/`
6. Commit with Conventional Commits

## Key Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run build` | Build SDK + emit declarations |
| `npm test` | Run all tests |
| `npm run test:coverage` | Tests with coverage |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run publish:jsr:dry-run` | JSR validation |

## Architecture Principles
- **Package-first**: SDK is a self-contained npm package with dual CJS/ESM
- **Adapter pattern**: Runtime-specific code in `adapters/`, shared logic in `src/`
- **Trait composition**: IoC container with `createTraitDescriptor` + `mergeTraits`
- **No runtime deps**: All dependencies are dev-only; SDK is zero-dependency at runtime
