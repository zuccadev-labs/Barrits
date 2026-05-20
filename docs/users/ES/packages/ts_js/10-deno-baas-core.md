# Deno BaaS Core (IoC, Schema)

> **Propósito**: Documentar los casos de uso, la arquitectura y las guías de implementación para las primitivas de Inversión de Control (IoC) y Generación de OpenAPI, todas inspiradas en la **Programación Orientada a Traits**.

Barrits va más allá de compilar y empaquetar. Al explotar el poder del AST generado durante la compilación, provee capacidades determinísticas en tiempo de ejecución perfectas para construir el núcleo de un **Backend-as-a-Service (BaaS)** en Deno, Node o cualquier otro runtime JS.

---

## 1. Inversión de Control Dinámica (IoC)

El `BarritsIoCContainer` es un contenedor de inyección de dependencias altamente optimizado que lee el manifiesto estático AST. En lugar de depender de decoradores en tiempo de ejecución (como `reflect-metadata`) que añaden sobrecarga y acoplamiento a frameworks, Barrits conecta las dependencias matemáticamente basándose en el análisis estático.

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
await container.wire();

// 4. Resolver instancias fácilmente
const db = await container.resolve<any>("Database");
```

---

## 2. Autogeneración de Esquema OpenAPI

Escribir YAML a mano o añadir decoradores pesados a tus controladores es propenso a errores. Barrits usa el trait `@barrits-trait http-endpoint` para inferir y generar automáticamente esquemas **OpenAPI v3.1** en milisegundos.

```typescript
import { generateOpenApiSchema } from "@zuccadev-labs/barrits/schema";

const schema = generateOpenApiSchema(manifest, {
  title: "My Corporate BaaS API",
  description: "Autogenerado desde Traits AST",
  version: "1.0.0"
});

console.log(JSON.stringify(schema, null, 2));
```

Esto garantiza que tu código y tu documentación de API estén **matemáticamente sincronizados**.

---

## 3. ¿Por qué no hay adaptadores de Base de Datos integrados?

Barrits se adhiere estrictamente al **Principio de Responsabilidad Única**. Como motor de orquestación y descubrimiento AST, delega los adaptadores de bases de datos (como Postgres, MongoDB o Deno KV) por completo al BaaS consumidor.

Esto garantiza que Barrits se mantenga ultra-ligero, seguro y enfocado puramente en orquestar tus capacidades.

---
[← Referencia de API](09-referencia-de-api.md) | [Índice](00-indice.md)
