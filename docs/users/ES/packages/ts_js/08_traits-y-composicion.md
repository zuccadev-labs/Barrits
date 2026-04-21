# 08 Traits y composición de ts_js

Los traits declarativos se usan cuando se necesita composición de dominio con contratos explícitos y menor drift entre implementación, metadata y tooling.

## Contrato base

La base es `createTraitDescriptor()` con las siguientes piezas:

| Campo | Propósito |
| :--- | :--- |
| `name` | Identificador único del trait |
| `requires` | Otros traits de los que depende este descriptor |
| `conflicts` | Traits que no pueden coexistir con este |
| `state` | Estado que posee exclusivamente este trait |
| `provides` | Capacidades expuestas a otros traits |
| `create` | Función factory que inicializa el trait |

```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  requires: ["DatabaseTrait"],
  provides: ["auth-session"],
  conflicts: ["legacy-auth"],
  state: { sessionCache: null },
  create: (deps) => ({
    getSession: async (userId: string) => deps.database.query("sessions", { userId }),
  }),
});
```

## Tags JSDoc declarativos

Cuando se prefiere menor fricción sobre objetos descriptores explícitos, los tags JSDoc declaran el mismo contrato:

```ts
/**
 * @barrits-trait
 * @barrits-summary Dominio de autenticación que provee gestión de sesiones
 * @barrits-requires DatabaseTrait
 * @barrits-provides auth-session
 * @barrits-conflicts legacy-auth
 * @barrits-state sessionCache
 * @barrits-stability stable
 * @barrits-runtime node,deno
 */
export const authTrait = createTraitDescriptor({ ... });
```

El motor de descubrimiento lee estos tags estáticamente desde el AST e los integra en el grafo de build.

## Composición de pipelines

`composePipeline` encadena transformaciones secuenciales con un valor inicial tipado:

```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (data) => validate(data),
  (data) => normalize(data),
  (data) => enrich(data),
);
```

## Beneficios del modelo de traits

1. **Ordenamiento** se resuelve desde dependencias declaradas, no desde mezcla manual de objetos.
2. **Dependencias faltantes** fallan explícitamente antes de ejecutar lógica opaca.
3. **Colisiones** se convierten en diagnósticos visibles en lugar de errores silenciosos en runtime.
4. **Propiedad del estado** está declarada, previniendo conflictos de estado mutable compartido entre dominios.

## Cuándo usar traits

Esta capa es apropiada al componer capacidades de dominio con contratos explícitos. Para una combinación trivial de dos utilidades, `mergeTraits` es suficiente. Para contratos de dominio serios — especialmente en sistemas distribuidos o monorepos grandes — `createTraitDescriptor` con `requires`, `provides` y `conflicts` explícitos debe ser la primera opción.
