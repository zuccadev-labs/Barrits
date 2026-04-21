# 05 Discovery, Inspection and Contracts

The technical core of Barrits relies on the deterministic discovery of code patterns and the generation of stable automation contracts.

## AST-Layer Discovery Engine

Unlike dynamic resolution tools, Barrits operates at the **Abstract Syntax Tree (AST)** layer using `@swc/core`. This allows the engine to:
- Extract metadata from comments, decorators, and strict types without executing the code.
- Identify Traits, Barrels, and domain relationships with zero runtime overhead.
- Maintain an incremental cache that reduces re-scan latency to nearly 0ms on subsequent runs.

## Automation Contracts

The engine translates the discovery graph into two primary first-class artifacts:

- **Build Manifest (`.barrits/build-manifest.json`)**: A sealed, cryptographic inventory of all discovered structures, used by bundlers and backend readers.
- **Watch Snapshot (`.cache/watch-snapshot.json`)**: A transient state descriptor used by development tools to monitor changes and update local orchestration.

## Inspection and Validation

The inspection system (`barrits/sdk/inspect.ts`) performs deep validation of the discovered graph, ensuring:
- **No Path Collisions**: Detecting duplicate labels across the file system.
- **Conflict Prevention**: Validating that provided and conflicting traits are respected.
- **Contract Integrity**: Verifying that the generated artifacts match the declared project configuration.

## Reader Abstraction

Consuming tools must use the validated readers in `barrits/consume` rather than parsing raw JSON artifacts. This abstraction ensures that any future changes to the manifest schema remain transparent to the consumer.
