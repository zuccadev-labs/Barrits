# Deno BaaS Core (IoC, Schema)

> **Propósito**: Documentar los casos de uso, la arquitectura y las guías de implementación para las primitivas de Inversión de Control (IoC) y Generación de OpenAPI, todas inspiradas en la **Programación Orientada a Traits**.

Barrits va más allá de compilar y empaquetar. Al explotar el poder del AST generado durante la compilación, provee capacidades determinísticas en tiempo de ejecución perfectas para construir el núcleo de un **Backend-as-a-Service (BaaS)** en Deno, Node o cualquier otro runtime JS.

---

## 1. Inversión de Control Dinámica (IoC)

El `BarritsIoCContainer` es un contenedor de inyección de dependencias altamente optimizado que lee el manifiesto estático AST. En lugar de depender de decoradores en tiempo de ejecución (como `reflect-metadata`) que añaden sobrecarga y acoplamiento a frameworks, Barrits resuelve las dependencias por nombre de capacidad; cada fábrica recibe el contenedor para resolver las suyas, los ciclos se informan con su cadena y las resoluciones concurrentes comparten una sola llamada a la fábrica.

### Ejemplo de Uso

```typescript
import { BarritsIoCContainer } from "@zuccadev-labs/barrits/ioc";

// 1. Inicializar el contenedor con el manifiesto AST
const container = new BarritsIoCContainer(manifest);

// 2. Registrar capacidades (ej. tu Base de Datos o Servicios)
container.register("Database", () => {
  return new CustomDatabaseAdapter("connection_string");
});

// 3. Auto-conectar todas las dependencias en tu aplicación
container.wire();

// 4. Resolver instancias fácilmente
const db = await container.resolve<any>("Database");
```

---

## 2. Autogeneración de Esquema OpenAPI

Escribir YAML a mano o añadir decoradores pesados a tus controladores es propenso a errores. Barrits usa el trait `@barrits-trait http-endpoint` para inferir y generar automáticamente esquemas **OpenAPI v3.1** en milisegundos.

```typescript
import { generateOpenApiSchema } from "@zuccadev-labs/barrits/schema/openapi";

const schema = generateOpenApiSchema(manifest, {
  title: "My Corporate BaaS API",
  description: "Autogenerado desde Traits AST",
  version: "1.0.0"
});

console.log(JSON.stringify(schema, null, 2));
```

`generateOpenApiSchema` documenta un endpoint por trait a partir de sus etiquetas `http:method=`/`http:path=` (declaradas con `@barrits-tags`).

---

### OpenAPI por rutas (desde 0.3.1)

Un trait de un BaaS suele exponer muchas rutas, creadas dentro de `create()`, donde el análisis estático
no las ve. Exponlas en una capacidad cuya clave contenga `routes`, monta esa lista en tu router y documenta
la misma lista: la spec no puede separarse de lo que sirve el servidor.

```typescript
import { composeTraitDescriptors, createTraitDescriptor } from "@zuccadev-labs/barrits";
import { collectRoutes, generateOpenApiFromRoutes } from "@zuccadev-labs/barrits/schema/openapi";

const users = createTraitDescriptor({
  name: "users",
  provides: ["users-routes"],
  create: () => ({
    "users-routes": [
      { method: "GET", path: "/users/:id", access: "user", handler: getUser, _openapi: { summary: "Obtener un usuario" } },
      { method: "POST", path: "/users", access: "admin", handler: createUser },
    ],
  }),
});

const { traits } = composeTraitDescriptors([users]);
for (const { route } of collectRoutes(traits)) router.on(route.method, route.path, route.handler);

const spec = generateOpenApiFromRoutes(traits, {
  title: "Mi BaaS",
  securitySchemes: { bearer: { type: "http", scheme: "bearer" } },
  securityFor: (route) => (route.access === "public" ? [] : [{ bearer: [] }]),
});
```

- Las rutas `:param` y `{param}` generan parámetros de ruta obligatorios; `_openapi` sustituye lo derivado.
- Salida determinista; un método+ruta u `operationId` duplicado lanza un error (`onDuplicate: "first"` imita a un router que sirve la primera coincidencia).
- Las rutas fuera de los traits (health checks) van en `extraRoutes`. Los métodos que OpenAPI no puede expresar (`*`) se omiten.

---

## 3. ¿Por qué no hay adaptadores de Base de Datos integrados?

Barrits se adhiere estrictamente al **Principio de Responsabilidad Única**. Como motor de orquestación y descubrimiento AST, delega los adaptadores de bases de datos (como Postgres, MongoDB o Deno KV) por completo al BaaS consumidor.

Esto garantiza que Barrits se mantenga ultra-ligero, seguro y enfocado puramente en orquestar tus capacidades.

---
[← Referencia de API](09-referencia-de-api.md) | [Índice](00-indice.md)
