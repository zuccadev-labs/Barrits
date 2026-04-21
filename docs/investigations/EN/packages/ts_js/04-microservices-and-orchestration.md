# Micro-Services Architecture and Orchestration

## Historical Context

Originally, the `barrits` parsing engine operated through a monolithic integration pipeline (centralized primarily in `inspect.ts` with over 1,600 lines of code). This monolith concentrated collision validation, syntactic injection, trait scrutiny, and file system crawling (DFS). As the SDK scales toward a high-demand adoption pattern for Deno and Node ecosystems under distributed architectures, that coupling limited code reuse and introduced considerable technical debt.

## Engineering Decision

A deep deconstruction of the central flow was carried out, rigorously applying **Single Responsibility Principle (SRP)** and adopting an isolated micro-services model.

The resulting fragmentation produced natively decoupled domains:

1. **`ast/cache`**: Dedicated 100% to preserving the "0ms Incremental AST Differential Caching" mechanism. Strictly controls stale SourceFiles and prevents the latency experienced in scraping-based ecosystems (e.g., repetitive disk reads).
2. **`ast/extractor`**: Asynchronous component for deep parsing of TS declarations and recursive `dependencies` reads.
3. **`ast/traits` and `ast/diagnostics`**: Isolated systems responsible for capturing corporate Godoc-style JSDoc and enforcing logical locks against internal collisions (traits cannot depend on their own slots, etc.).
4. **`graph/collisions` and `imports`**: Dedicated integration monitors for alias mapping and runtime overrides.
5. **`crawler/layer`**: Isolation of the disk scanner through a clean DFS without mutating logic.

With this architecture, `inspect.ts` was reduced to its minimal expression (< 300 lines), operating as a transparent orchestrator of the ecosystem.

## Outcomes and Advantages

1. **Team Scalability**: A platform engineer can now maintain the cache graph (`ast/cache`) while another refines the domain diagnostics logic (`ast/diagnostics`), operating natively without creating Merge conflicts in a global monolith.
2. **Distributed Architecture**: Positions `barrits` to serve as a large-scale orchestration core, suitable for secure Deno deployments in distributed environments.
3. **Maintainability**: Internal documentation is governed under strict Godoc-style JSDoc — each micro-service has its own justification in code declaring not "what step one does, step two does" but "what architectural responsibility its interface signature resolves."

## Regression Prevention

To maintain this flow:

- Never mix file system mapping (`crawler/*`) with abstract syntax abstractions (`ast/*`).
- Do not regress recursive deep injection into the Orchestrator (`inspect.ts`).
- Continue guarding all cryptographic validation in isolated components through `checksum` signature validation, guaranteeing to consuming ecosystems that the supply chain has not been falsified or substituted.

---

[← Index](00-index.md)
