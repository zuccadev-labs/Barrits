# Deno BaaS Core (Barrits v0.1.7+)

This example demonstrates the extreme power of Barrits when used to build a Backend-as-a-Service (BaaS) architecture using Deno.

## How it works

1. **Auto OpenAPI Generation:** The `generateOpenApiSchema` reads the `http-endpoint` traits and creates a full Swagger/OpenAPI v3.1 JSON definition representing all available endpoints.
2. **IoC Mock Database:** The container (`container.register`) resolves a mock generic database to endpoints that requested it via `@barrits-state Database`.
3. **OpenAPI Schema Generator:** The AST traits are seamlessly transformed into a valid OpenAPI v3.1 Schema without relying on heavy runtime reflection.

## Running the Example
```bash
deno task start
```
