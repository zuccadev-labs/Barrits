# 02 Node.js and Deno

The server-side examples demonstrate how to use Barrits as a portable orchestration core across different server runtimes.

## Node.js Integration (`example-nodejs`)

Focuses on the classic Node.js ecosystem, showcasing:
- Use of the `defineBarritsPackage` API for discovery.
- Consuming the `barrits/node` adapter for CLI and filesystem access.
- Reading and validating build manifests for downstream consumption.

## Deno Integration (`example-deno`)

Demonstrates porting the same orchestration logic to the Deno-native surface:
- Direct JSR imports.
- Use of the `barrits/deno` adapter.
- Verification of cross-runtime parity with zero code duplication in the core logic.

## Common Operations

Both examples follow the same operational lifecycle:
1.  **Discovery**: Scanning the project for traits and barrels.
2.  **Manifest Generation**: Saving the sealed `.barrits/build-manifest.json`.
3.  **Consumption**: Using the `consume` API to read the generated graph.
