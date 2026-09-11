# Barrits Comprehensive Example

**Expert-level demonstration of Barrits' complete capability matrix.**

## Architecture Overview

This example builds a distributed system using **trait-oriented architecture** with four-layer hierarchy:

```
┌─────────────────────────────────────────┐
│          Analytics (cross-cutting)      │  provides: analytics:track, analytics:report
├─────────────────────────────────────────┤
│         API Gateway (orchestration)     │  requires: db:query, cache:get, cache:set
├─────────────────────────────────────────┤
│       Cache Layer (performance)         │  requires: db:query, db:execute
├─────────────────────────────────────────┤
│      Data Layer (persistence)           │  provides: db:query, db:execute, db:transaction
└─────────────────────────────────────────┘
```

## Trait Hierarchy & Dependency Satisf action

### Data Layer (Foundation)
- **Responsibility**: Persistence, transactions, query execution
- **Provides**: `db:query`, `db:execute`, `db:transaction`
- **State**: Connection pool, transaction context
- **Rationale**: Foundational trait that other layers depend on; manages database lifecycle

### Cache Layer (Performance)
- **Responsibility**: Caching, TTL management, cache invalidation
- **Requires**: `db:query`, `db:execute` (fallback to database on cache miss)
- **Provides**: `cache:get`, `cache:set`, `cache:invalidate`
- **Conflict Strategy**: `left` (cache wins on read, database on miss)
- **Trade-off**: Reduced database load vs. potential stale data—mitigated by TTL

### API Gateway (Integration)
- **Responsibility**: HTTP routing, request handling, response serialization
- **Requires**: `db:query` (direct queries), `cache:get`, `cache:set` (request caching)
- **Provides**: `http:listen`, `http:route`
- **Rationale**: Sits at the top, depends on all underlying layers; single point of orchestration

### Analytics (Cross-Cutting)
- **Responsibility**: Event tracking, metrics aggregation, reporting
- **Requires**: `cache:set` (event buffering), `http:route` (reporting endpoints)
- **Provides**: `analytics:track`, `analytics:report`
- **Gotcha**: Avoid circular dependencies—analytics must NOT require analytics features

## Patterns Demonstrated

### 1. **Discovery**
Barrits automatically discovers all traits in the `barrits/` directory using AST-based introspection:
```bash
npm run inspect
```
Output shows trait metadata, provides/requires, and integration graph.

### 2. **Composition**
Traits compose via explicit `mergeTraits()` calls with conflict resolution:
- **throw**: Fail on conflicting capabilities (safe by default)
- **left/right**: First or second trait wins in conflicts
- See `scenario-2-composition.ts` for examples

### 3. **Diagnostics**
Barrits detects common errors:
- **Drift**: Documented behavior missing from implementation
- **Collisions**: Multiple traits providing same capability
- **Dangling Requires**: Trait needs capability nobody provides
- See `scenario-3-diagnostics.ts`

### 4. **IoC Container**
Central registry for capability resolution with cycle detection:
```typescript
container.register("db:query", factory);
const result = container.resolve("db:query");
```
See `scenario-4-ioc.ts`

### 5. **Build Manifests**
Generates checksum-validated manifest at build time, consumed at runtime:
```json
{
  "version": "0.3.0",
  "traits": [...],
  "checksum": "abc123..."
}
```
See `scenario-5-manifest.ts`

### 6. **OpenAPI Generation**
Traits with `http:method` and `http:path` metadata auto-generate OpenAPI v3.1:
```typescript
const schema = generateOpenApiSchema(traits, { title, version });
```
See `scenario-6-openapi.ts`

### 7. **Namespaced API**
Create isolated instances with custom namespace:
```typescript
const barrits = createBarrits({ namespace: "myapp", ... });
```
See `scenario-7-namespaced.ts`

## Extension Paths

### Adding a New Trait
1. Create `barrits/traits/new-trait.ts` with `@trait` JSDoc
2. Define provides/requires in metadata
3. Export from `barrits/traits/index.ts`
4. Barrits auto-discovers on next run

### Custom Conflict Strategies
Extend `TRAIT_CONFLICT_STRATEGIES` in `src/barrits/config.ts`:
```typescript
TRAIT_CONFLICT_STRATEGIES: ["throw", "left", "right", "custom-merge"]
```

### Plugin Architecture
Use `plugins/` for bundler-specific behavior (Vite, webpack, etc.):
- Virtual modules: `barrits:manifest`, `barrits:inspection`
- Runtime traits discovery in build pipeline

## Common Gotchas

1. **Circular Dependencies**: Analytics must NOT require analytics features. Use dependency inversion (event emitters, callbacks)
2. **State Mutations**: Trait state is shared—be careful with concurrent access
3. **Async Composition**: `mergeTraits()` is synchronous; use `await` for runtime resolution
4. **Type Safety**: JSDoc `@param` and `@returns` are not auto-validated; test trait contracts explicitly

## Testing Strategy

Run all scenarios:
```bash
npm test
```

Expected: 8+ test cases passing, demonstrating:
- Trait creation and composition
- Dependency satisfaction
- Conflict detection
- IoC resolution
- Manifest validation
- OpenAPI schema generation
- Namespaced isolation

## References

- **Barrits SDK**: `@zuccadev-labs/barrits/sdk`
- **IoC Container**: `@zuccadev-labs/barrits/ioc`
- **OpenAPI**: `@zuccadev-labs/barrits/schema/openapi`
- **Main Docs**: See root README.md

---

**Status**: Production-ready pattern reference | **Last Updated**: 2026-09-11
