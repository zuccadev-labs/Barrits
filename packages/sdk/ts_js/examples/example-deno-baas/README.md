# example-deno-baas — Deno Backend-as-a-Service Core

## Purpose

This example demonstrates how the Barrits SDK serves as the orchestration
foundation for a Backend-as-a-Service (BaaS) architecture using Deno.
It exercises three core Barrits capabilities in a BaaS context:

- **IoC Dependency Injection**: Wiring database, request handler, and runtime
  configuration via the `BarritsIoCContainer`, with concrete implementations
  registered by the consumer BaaS layer.
- **OpenAPI Schema Auto-Generation**: Generating an OpenAPI v3.1 schema from
  trait descriptors tagged with `http-endpoint`, eliminating documentation
  desync between implementation and API specs.
- **Trait Discovery**: Declaring runtime, database, and HTTP endpoint
  capabilities using typed trait descriptors with provides/consumes/state
  contracts.

## Architecture

```
example-deno-baas/
├── barrits/                    # Barrits orchestration layer
│   ├── traits/
│   │   ├── index.ts            # Barrel re-exporting all traits
│   │   ├── runtime-trait.ts    # Deno runtime capability declaration
│   │   ├── database-service.ts # Generic database capability
│   │   └── http-endpoint.ts    # HTTP API endpoint tagged for OpenAPI
│   └── index.ts                # BaaS path builders
├── barrits.config.ts           # Root configuration with Deno runtime
├── deno.json                   # Deno task definitions
├── main.ts                     # Primary entrypoint
└── README.md                   # This file
```

## What This Example Demonstrates

### 1. Trait-Oriented Service Declaration

Three traits model the BaaS domain:
- **runtime-deno-baas** — Declares the Deno runtime capability (`runtime:deno`)
  and `RuntimeConfig` state
- **database-service** — Declares a generic database connection (`database:connection`)
  consuming the runtime and owning `Database` state
- **users-api** — HTTP API endpoint (`http:api`) consuming the database and
  tagged with `http-endpoint` for OpenAPI discovery

### 2. IoC Container Wiring

The `BarritsIoCContainer` reads the build manifest and wires dependencies
based on the trait contracts:
- `RuntimeConfig` → resolved from the runtime trait's state
- `Database` → concrete DenoKV adapter registered by the BaaS
- `RequestHandler` → HTTP handler wired to the database

### 3. OpenAPI Schema Generation

`generateOpenApiSchema` reads trait descriptors tagged with `http-endpoint`
and produces a valid OpenAPI v3.1 schema, demonstrating API discovery from
source-level annotations without runtime reflection.

## Execution

```bash
deno task start           # Execute the BaaS orchestration demo
deno task dev             # Run with file watching
deno task build           # Build manifest via CLI
deno task inspect         # Inspect the build contract graph
```

## API Functions Used

| Function | Purpose |
|----------|---------|
| `defineBarritsPackage` | Declares the consumer runtime identity and discovery policy |
| `BarritsIoCContainer` | Lightweight DI container reading build manifest contracts |
| `generateOpenApiSchema` | Generates OpenAPI v3.1 schema from tagged traits |

## Design Notes

This example intentionally uses a minimal trait surface (3 traits) to
illustrate the BaaS pattern clearly. A production BaaS would expand this
with additional traits for authentication, rate limiting, logging, and
custom business domains.

The concrete database adapter (DenoKV) is registered by the consumer BaaS
layer, not by Barrits itself, adhering to the strict database delegation
principle documented in ADR 06.
