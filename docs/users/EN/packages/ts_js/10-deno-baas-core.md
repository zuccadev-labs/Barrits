# Deno BaaS Core (IoC, Schema)

> **Purpose**: Document the use cases, architecture, and implementation guides for the Inversion of Control (IoC) and OpenAPI Generation primitives, all inspired by **Trait-Oriented Programming**.

Barrits goes beyond compiling and bundling. By exploiting the power of the AST generated during compilation, it provides deterministic runtime capabilities perfect for building a **Backend-as-a-Service (BaaS)** core in Deno, Node, or any other JS runtime.

---

## 1. Dynamic Inversion of Control (IoC)

The `BarritsIoCContainer` is a highly optimized, dependency injection container that reads the static AST manifest. Instead of relying on runtime decorators (like `reflect-metadata`) which add overhead and framework lock-in, Barrits wires dependencies mathematically based on static analysis.

### Usage Example

```typescript
import { BarritsIoCContainer } from "@zuccadev-labs/barrits/ioc";

// 1. Initialize container with the AST manifest
const container = new BarritsIoCContainer(manifest);

// 2. Register capabilities (e.g. your custom Database or Services)
container.register("Database", () => {
  return new CustomDatabaseAdapter("connection_string");
});

// 3. Auto-Wire all dependencies across your application
await container.wire();

// 4. Resolve instances easily
const db = await container.resolve<any>("Database");
```

---

## 2. Auto OpenAPI Schema Generation

Writing YAML by hand or adding heavy decorators to your controllers is error-prone. Barrits uses the `@barrits-trait http-endpoint` to automatically infer and generate **OpenAPI v3.1** schemas in milliseconds.

```typescript
import { generateOpenApiSchema } from "@zuccadev-labs/barrits/schema";

const schema = generateOpenApiSchema(manifest, {
  title: "My Corporate BaaS API",
  description: "Auto-generated from AST Traits",
  version: "1.0.0"
});

console.log(JSON.stringify(schema, null, 2));
```

This ensures your code and your API documentation are **mathematically synchronized**.

---

## 3. Why No Built-in Database Adapters?

Barrits adheres strictly to the **Single Responsibility Principle**. As an orchestration and AST-discovery engine, it delegates database adapters (like Postgres, MongoDB, or Deno KV) entirely to the consumer BaaS. 

This guarantees Barrits remains ultra-lightweight, secure, and focused purely on orchestrating your capabilities.

---
[← API Reference](09-api-reference.md) | [Index](00-index.md)
