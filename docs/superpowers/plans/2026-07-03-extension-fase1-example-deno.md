# Fase 1 — example-deno: Traits + OpenAPI + IoC + Tests

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extender example-deno con traits JSDoc, scripts OpenAPI/IoC, y tests Deno, replicando el patrón de example-nodejs.

**Architecture:** El ejemplo Deno existente (main.ts con utilidades orchestradas) se extiende con traits en `barrits/traits/`, scripts de demostración en `scripts/`, y tests en `tests/`. Las importaciones del SDK son directas desde `../../dist/adapters/deno/mod.js` para funcionalidad principal y desde `../../src/barrits/` para IoC/OpenAPI (fuentes TS, Deno las ejecuta directamente).

**Tech Stack:** Deno, Barrits SDK (adapter Deno), Deno.test

---

## Mapa de archivos

### Crear (7 archivos)

| Archivo | Responsabilidad |
|---|---|
| `barrits/traits/runtime-trait.ts` | Trait `denoRuntimeTrait` — proporciona `runtime:deno` |
| `barrits/traits/parse-service.ts` | Trait `parseServiceTrait` — CRUD de usuarios estilo Parse-Server |
| `barrits/traits/http-handler.ts` | Trait `httpHandlerTrait` — tag `http-endpoint` para OpenAPI |
| `barrits/traits/index.ts` | Barrel export de los 3 traits |
| `scripts/openapi-demo.ts` | Genera esquema OpenAPI v3.1 desde manifest mock |
| `scripts/ioc-demo.ts` | Contenedor IoC con registro/resolución de servicios |
| `tests/example.test.ts` | Suite de tests con `Deno.test` |

### Modificar (2 archivos)

| Archivo | Cambio |
|---|---|
| `deno.json` | Agregar tasks `test`, `demo:openapi`, `demo:ioc` |
| `README.md` | Agregar secciones Traits/OpenAPI/IoC/Tests, eliminar "How it works" |

---

### Task 1: Crear runtime-trait.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/barrits/traits/runtime-trait.ts`

**Interfaces:**
- Produces: `denoRuntimeTrait` — `TraitDescriptor` con `name: "runtime-deno"`, `provides: ["runtime:deno"]`

- [ ] **Step 1: Crear archivo**

```typescript
import { createTraitDescriptor } from "../../../../dist/adapters/deno/mod.js";

export const denoRuntimeTrait = createTraitDescriptor({
  name: "runtime-deno",
  provides: ["runtime:deno"],
  create: () => ({
    getRuntimeName: () => "deno",
  }),
});
```

- [ ] **Step 2: Verificar sintaxis**

Run: `deno check barrits/traits/runtime-trait.ts`
Expected: no errors (exit 0)

---

### Task 2: Crear parse-service.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/barrits/traits/parse-service.ts`

**Interfaces:**
- Produces: `parseServiceTrait` — `TraitDescriptor` con `name: "parse-service"`, `provides: ["parse:crud"]`, `state: { ... }`

- [ ] **Step 1: Crear archivo**

```typescript
import { createTraitDescriptor } from "../../../../dist/adapters/deno/mod.js";

export type ParseUser = { objectId: string; username: string; role: string };
export type ParseService = {
  list: () => ParseUser[];
  get: (id: string) => ParseUser | undefined;
  create: (user: Omit<ParseUser, "objectId">) => ParseUser;
  remove: (id: string) => boolean;
};

export const parseServiceTrait = createTraitDescriptor({
  name: "parse-service",
  provides: ["parse:crud"],
  state: { users: { type: "array", items: { type: "object" } } },
  create: () => {
    const users: ParseUser[] = [];
    return {
      list: () => [...users],
      get: (id: string) => users.find((u) => u.objectId === id),
      create: (user: Omit<ParseUser, "objectId">) => {
        const newUser: ParseUser = { objectId: crypto.randomUUID(), ...user };
        users.push(newUser);
        return newUser;
      },
      remove: (id: string) => {
        const idx = users.findIndex((u) => u.objectId === id);
        if (idx === -1) return false;
        users.splice(idx, 1);
        return true;
      },
    };
  },
});
```

- [ ] **Step 2: Verificar sintaxis**

Run: `deno check barrits/traits/parse-service.ts`
Expected: no errors

---

### Task 3: Crear http-handler.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/barrits/traits/http-handler.ts`

**Interfaces:**
- Produces: `httpHandlerTrait` — `TraitDescriptor` con `name: "http-handler"`, `tags: ["http-endpoint", "runtime"]`

- [ ] **Step 1: Crear archivo**

```typescript
import { createTraitDescriptor } from "../../../../dist/adapters/deno/mod.js";

export const httpHandlerTrait = createTraitDescriptor({
  name: "http-handler",
  provides: ["http:request"],
  tags: ["http-endpoint", "runtime"],
  create: () => ({
    handle: async (req: { method: string; path: string; body?: unknown }) => {
      return { status: 200, body: { ok: true, path: req.path } };
    },
  }),
});
```

- [ ] **Step 2: Verificar sintaxis**

Run: `deno check barrits/traits/http-handler.ts`
Expected: no errors

---

### Task 4: Crear traits/index.ts (barrel)

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/barrits/traits/index.ts`

- [ ] **Step 1: Crear archivo**

```typescript
export { denoRuntimeTrait } from "./runtime-trait.ts";
export { parseServiceTrait } from "./parse-service.ts";
export { httpHandlerTrait } from "./http-handler.ts";
```

- [ ] **Step 2: Verificar barrel**

Run: `deno check barrits/traits/index.ts`
Expected: no errors

---

### Task 5: Crear scripts/openapi-demo.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/scripts/openapi-demo.ts`

**Dependencies:** `generateOpenApiSchema` desde `../../src/barrits/schema/openapi.ts`

- [ ] **Step 1: Crear archivo**

```typescript
import { generateOpenApiSchema } from "../../src/barrits/schema/openapi.ts";
import type { BarritsBuildManifest } from "../../dist/adapters/deno/mod.js";

const mockManifest: BarritsBuildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mock",
  projectRoot: Deno.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 3,
  exportsCount: 3,
  publicExportsCount: 3,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [
    {
      name: "http-handler",
      sourceFile: "barrits/traits/http-handler.ts",
      bindingName: "httpHandlerTrait",
      bindingKind: "const",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["http:request"],
      tags: ["http-endpoint", "runtime"],
      runtimes: ["deno"],
    },
  ],
};

const schema = generateOpenApiSchema(mockManifest, {
  title: "Example Deno Parse-Server API",
  version: "1.0.0",
  description: "Generated from Barrits AST trait discovery (Deno)",
});

console.log(JSON.stringify(schema, null, 2));
```

- [ ] **Step 2: Verificar ejecución**

Run: `deno run -A scripts/openapi-demo.ts`
Expected: JSON output with `openapi: "3.1.0"`, `paths: {"/http-handler": ...}`

---

### Task 6: Crear scripts/ioc-demo.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/scripts/ioc-demo.ts`

**Dependencies:** `BarritsIoCContainer` desde `../../../src/barrits/ioc/index.ts`

- [ ] **Step 1: Crear archivo**

```typescript
import { BarritsIoCContainer } from "../../../src/barrits/ioc/index.ts";
import type { BarritsBuildManifest } from "../../../dist/adapters/deno/mod.js";

type Config = { port: number; env: string };
type Logger = { info: (msg: string) => void };
type ParseService = { list: () => string[]; create: (name: string) => string };

const manifest: BarritsBuildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mock",
  projectRoot: Deno.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 3,
  exportsCount: 3,
  publicExportsCount: 3,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [],
};

const container = new BarritsIoCContainer(manifest);

container.register<Config>("config", () => ({ port: 3000, env: "development" }));

container.register<Logger>("logger", async (c) => {
  const config = await c.resolve<Config>("config");
  return { info: (msg: string) => console.log(`[${config.env}] ${msg}`) };
});

container.register<ParseService>("parse:crud", async (c) => {
  let nextId = 1;
  const items: string[] = [];
  return {
    list: () => [...items],
    create: async (name: string) => {
      const id = `obj_${nextId++}`;
      items.push(name);
      const logger = await c.resolve<Logger>("logger");
      logger.info(`object created: ${name} (${id})`);
      return id;
    },
  };
});

await container.wire();

const config = await container.resolve<Config>("config");
const parseService = await container.resolve<ParseService>("parse:crud");

console.log(`Config: port=${config.port}, env=${config.env}`);
const id1 = await parseService.create("Alice");
const id2 = await parseService.create("Bob");
console.log("Objects:", parseService.list().join(", "));
```

- [ ] **Step 2: Verificar ejecución**

Run: `deno run -A scripts/ioc-demo.ts`
Expected: output containing "Config: port=3000, env=development" and "Objects: Alice, Bob"

---

### Task 7: Crear tests/example.test.ts

**Files:**
- Create: `packages/sdk/ts_js/examples/example-deno/tests/example.test.ts`

- [ ] **Step 1: Crear archivo**

```typescript
import { assertEquals, assertExists, assertStringIncludes } from "jsr:@std/assert@^1.0.8";

Deno.test("traits: loads runtime trait", async () => {
  const mod = await import("../barrits/traits/runtime-trait.ts");
  assertEquals(mod.denoRuntimeTrait.name, "runtime-deno");
});

Deno.test("traits: loads parse service trait", async () => {
  const mod = await import("../barrits/traits/parse-service.ts");
  assertEquals(mod.parseServiceTrait.name, "parse-service");
  assertEquals(mod.parseServiceTrait.provides, ["parse:crud"]);
});

Deno.test("traits: loads http handler trait", async () => {
  const mod = await import("../barrits/traits/http-handler.ts");
  assertEquals(mod.httpHandlerTrait.name, "http-handler");
  assertEquals(mod.httpHandlerTrait.tags?.includes("http-endpoint"), true);
});

Deno.test("traits: re-exports all traits from barrel", async () => {
  const mod = await import("../barrits/traits/index.ts");
  assertExists(mod.denoRuntimeTrait);
  assertExists(mod.parseServiceTrait);
  assertExists(mod.httpHandlerTrait);
});

Deno.test("parse-service: CRUD operations", async () => {
  const { parseServiceTrait } = await import("../barrits/traits/parse-service.ts");
  const { create } = parseServiceTrait;
  const svc = create();
  assertEquals(svc.list(), []);

  const user = svc.create({ username: "admin", role: "super" });
  assertEquals(user.username, "admin");
  assertEquals(svc.list().length, 1);

  const found = svc.get(user.objectId);
  assertEquals(found?.username, "admin");

  const removed = svc.remove(user.objectId);
  assertEquals(removed, true);
  assertEquals(svc.list().length, 0);
});

Deno.test("OpenAPI: generates schema from manifest", async () => {
  const { generateOpenApiSchema } = await import("../../src/barrits/schema/openapi.ts");
  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory",
    discoveryRoots: [],
    filesCount: 1,
    exportsCount: 1,
    publicExportsCount: 1,
    internalExportsCount: 0,
    barrelsCount: 1,
    domains: ["api"],
    traitDiagnostics: [],
    importActions: [],
    collisions: [],
    traitDescriptors: [{
      name: "http-handler",
      sourceFile: "traits/http-handler.ts",
      bindingName: "httpHandlerTrait",
      bindingKind: "const",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: ["http:request"],
      tags: ["http-endpoint"],
      runtimes: ["deno"],
    }],
  };
  const schema = generateOpenApiSchema(manifest);
  assertEquals(schema.openapi, "3.1.0");
  assertExists(schema.paths["/http-handler"]);
});

Deno.test("IoC: registers and resolves services", async () => {
  const { BarritsIoCContainer } = await import("../../src/barrits/ioc/index.ts");
  const manifest = {
    generatedAt: new Date().toISOString(),
    checksum: "sha256-test",
    projectRoot: Deno.cwd(),
    barritsDirectory: ".barrits",
    strategy: "current-directory",
    discoveryRoots: [],
    filesCount: 0,
    exportsCount: 0,
    publicExportsCount: 0,
    internalExportsCount: 0,
    barrelsCount: 0,
    domains: [],
    traitDiagnostics: [],
    importActions: [],
    collisions: [],
    traitDescriptors: [],
  };

  const container = new BarritsIoCContainer(manifest);
  container.register("config", () => ({ port: 3000, env: "test" }));
  container.register("greeter", async (c) => {
    const config = await c.resolve<{ port: number; env: string }>("config");
    return { greet: (name: string) => `Hello ${name} (${config.env})` };
  });

  await container.wire();
  const greeter = await container.resolve<{ greet: (n: string) => string }>("greeter");
  assertEquals(greeter.greet("World"), "Hello World (test)");
});

Deno.test("showcase: main.ts runs successfully", async () => {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", "main.ts"],
    stdout: "piped",
    stderr: "piped",
  });
  const { stdout, stderr, code } = await cmd.output();
  const output = new TextDecoder().decode(stdout);
  const errorOut = new TextDecoder().decode(stderr);
  assertEquals(code, 0, `exit ${code}: ${errorOut}`);
  assertStringIncludes(output, "Orchestration complete");
});
```

- [ ] **Step 2: Verificar tests**

Run: `deno test -A --check`
Expected: all tests PASS

---

### Task 8: Modificar deno.json con nuevas tareas

**Files:**
- Modify: `packages/sdk/ts_js/examples/example-deno/deno.json`

- [ ] **Step 1: Actualizar deno.json**

Agregar las tareas `test`, `demo:openapi`, `demo:ioc` al objeto `tasks`:

```json
{
  "tasks": {
    "dev": "deno run -A ./main.ts",
    "build": "deno run -A ../../adapters/deno/cli.ts build . -- deno run -A ./scripts/build-consumer.ts",
    "inspect": "deno run -A ../../adapters/deno/cli.ts info .",
    "test": "deno test -A",
    "demo:openapi": "deno run -A ./scripts/openapi-demo.ts",
    "demo:ioc": "deno run -A ./scripts/ioc-demo.ts"
  }
}
```

- [ ] **Step 2: Verificar tareas**

Run: `deno task test`
Expected: all tests PASS
Run: `deno task demo:openapi`
Expected: JSON output con OpenAPI schema
Run: `deno task demo:ioc`
Expected: output con "Config: port=3000, env=development"

---

### Task 9: Actualizar README.md

**Files:**
- Modify: `packages/sdk/ts_js/examples/example-deno/README.md`

**Cambios:**
1. Eliminar la sección "How it works" (líneas 79-94, texto duplicado sobre trait discovery)
2. Agregar secciones:
   - Traits: `#### 6. Trait Composition` después de la sección 5
   - OpenAPI: `#### 7. OpenAPI Schema Generation` 
   - IoC: `#### 8. Dependency Injection`
   - Tests: `#### 9. Automated Tests`
3. Agregar comandos en "Execution"

- [ ] **Step 1: Editar README.md**

Eliminar la sección "How it works" (desde la línea 79 "## How it works" hasta el final).

Agregar después de la línea 63 (sección "Execution"):

```markdown
### 6. Trait Composition

Three traits are defined under `barrits/traits/`:

- **`runtime-trait`** — Declares the Deno runtime identity (`runtime:deno`)
- **`parse-service`** — Parse-Server style CRUD operations (`parse:crud`)
- **`http-handler`** — HTTP request handler (`http:request`) tagged for OpenAPI

### 7. OpenAPI Schema Generation

The `scripts/openapi-demo.ts` script reads the trait descriptors from a build manifest and generates an OpenAPI v3.1 schema. Traits tagged with `http-endpoint` are mapped to API paths, with their `provides` capabilities translated to HTTP methods and request/response schemas.

### 8. Dependency Injection

The `scripts/ioc-demo.ts` script demonstrates the `BarritsIoCContainer` — a lightweight DI container that registers services, wires dependencies, and resolves them on demand. This replaces manual dependency management with a declarative registration pattern.

### 9. Automated Tests

Tests are in `tests/example.test.ts` and use the native `Deno.test` runner:

- Trait loading and barrel re-exports
- Parse-service CRUD operations
- OpenAPI schema generation
- IoC container registration and resolution
- Main showcase execution integrity

## Execution

```bash
deno task dev           # Execute the orchestration entrypoint
deno task test          # Run the automated test suite
deno task build         # Build and inspect the contract graph
deno task inspect       # Inspect the build manifest
deno task demo:openapi  # Generate OpenAPI schema from trait descriptors
deno task demo:ioc      # Run the dependency injection demo
```

Also update the table of API Functions to include trait-related functions.
```

- [ ] **Step 2: Verificar render**

Run: `deno eval "console.log(await Deno.readTextFile('README.md'))" | findstr "How it works"`
Expected: no output (sección eliminada)

---

### Self-Review

**1. Spec coverage:**
- ✅ Traits: Tasks 1-4 crean 3 traits + barrel
- ✅ OpenAPI demo: Task 5 crea script con `generateOpenApiSchema`
- ✅ IoC demo: Task 6 crea script con `BarritsIoCContainer`
- ✅ Tests: Task 7 crea 8 tests con cobertura completa
- ✅ deno.json: Task 8 agrega 3 tasks
- ✅ README: Task 9 limpia y agrega documentación

**2. Placeholder scan:** Ningún placeholder. Todo el código está completo en cada step.

**3. Type consistency:**
- `denoRuntimeTrait.name === "runtime-deno"` (Task 1) coincide con test (Task 7)
- `parseServiceTrait.name === "parse-service"` (Task 2) coincide con test (Task 7)
- `httpHandlerTrait.name === "http-handler"` (Task 3) coincide con test (Task 7)
- `generateOpenApiSchema` retorna `Record<string, any>` (Task 5) coincide con `schema.openapi === "3.1.0"` (Task 7)
- `BarritsIoCContainer.register/resolve/wire` firmas consistentes entre Task 6 y Task 7
