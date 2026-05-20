---
title: "Referencia de API — Traits y Composición"
description: "Documentación técnica corporativa sobre el sistema de composición basado en Traits de Barrits."
---

# Referencia de API — Traits y Composición

Esta referencia cubre el sistema de composición basado en traits de `@zuccadev-labs/barrits`. Los Traits constituyen un concepto fundamental en Barrits para definir capacidades, dependencias y contratos entre las diferentes partes del sistema.

> [!NOTE]
> Los Traits permiten formalizar la arquitectura de un proyecto mediante contratos declarativos verificables en tiempo de build.

---

## Descriptor de Trait

### `createTraitDescriptor(input)`

Crea un descriptor de trait reutilizable a partir de metadatos explícitos.

**Parámetros:**
- `input`: TraitDescriptorInput — El objeto de definición del trait

**Retorna:** TraitDescriptor — Un descriptor de trait componible

**Ejemplo:**
```ts
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 * @barrits-state currentUser, connectionPool
 * @barrits-consumes logger, config
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session", "database-adapter"],
  conflicts: ["legacy-adapter"],
  state: ["currentUser", "connectionPool"],
  consumes: ["logger", "config"]
});
```

### `createTraitDescriptorFromJsDoc(jsDoc, descriptor)`

Crea un descriptor a partir de un bloque JSDoc existente.

**Parámetros:**
- `jsDoc`: string — El bloque de comentario JSDoc
- `descriptor`: Partial\<TraitDescriptor\> — Sobrecargas opcionales para el descriptor

**Retorna:** TraitDescriptor — Un descriptor de trait componible

**Ejemplo:**
```ts
import { createTraitDescriptorFromJsDoc } from "@zuccadev-labs/barrits";

export const authTrait = createTraitDescriptorFromJsDoc(`
/**
 * @barrits-trait
 * @barrits-provides auth-session, database-adapter
 * @barrits-conflicts legacy-adapter
 * @barrits-state currentUser, connectionPool
 * @barrits-consumes logger, config
 */
`);
```

### `parseTraitDescriptorJsDoc(value)`

Parsea JSDoc en metadatos estructurados de trait.

**Parámetros:**
- `value`: string — El bloque de comentario JSDoc

**Retorna:** TraitDescriptorJsDocMetadata — Los metadatos JSDoc parseados

**Tags declarativos reconocidos:**

| Tag | Propósito |
| :--- | :--- |
| `@barrits-trait` | Marca un bloque JSDoc como contrato de trait |
| `@barrits-summary` | Descripción corta del trait |
| `@barrits-requires` | Traits de los que depende este descriptor |
| `@barrits-conflicts` | Traits que no pueden coexistir con este |
| `@barrits-state` | Estado gestionado por este trait |
| `@barrits-consumes` | Capacidades consumidas de otros traits |
| `@barrits-provides` | Capacidades expuestas a otros traits |
| `@barrits-tags` | Etiquetas de clasificación |
| `@barrits-runtime` | Restricción de runtime objetivo |
| `@barrits-version` | Restricción de versión |
| `@barrits-stability` | Nivel de estabilidad (stable, experimental, deprecated) |

**Ejemplo:**
```ts
import { parseTraitDescriptorJsDoc } from "@zuccadev-labs/barrits";

const jsDoc = `
 * @barrits-trait
 * @barrits-provides auth-session
 * @barrits-state user
`;

const metadata = parseTraitDescriptorJsDoc(jsDoc);
// Retorna: { provides: ["auth-session"], state: ["user"] }
```

### `mergeTraits(...traits)`

Fusiona traits en un resultado consolidado único.

**Parámetros:**
- `traits`: TraitDescriptor[] — Array de descriptores de trait a fusionar

**Retorna:** ComposedTraitDescriptorsResult — El resultado de la composición fusionada

**Ejemplo:**
```ts
import { mergeTraits, createTraitDescriptor } from "@zuccadev-labs/barrits";

const authTrait = createTraitDescriptor({
  name: "Auth",
  provides: ["session"],
  state: ["user"]
});

const dbTrait = createTraitDescriptor({
  name: "Database",
  provides: ["connection"],
  state: ["pool"]
});

const result = mergeTraits(authTrait, dbTrait);
// result contiene provides, state, etc. combinados
```

### `composeTraitDescriptors(input)`

Compone múltiples descriptores de trait en una estructura final fusionada.

**Parámetros:**
- `input`: ComposeTraitDescriptorsOptions — Opciones para la composición de traits

**Retorna:** ComposedTraitDescriptorsResult — Los descriptores de trait compuestos

**Ejemplo:**
```ts
import { composeTraitDescriptors, createTraitDescriptor } from "@zuccadev-labs/barrits";

const traits = [
  createTraitDescriptor({ name: "Auth", provides: ["session"] }),
  createTraitDescriptor({ name: "DB", provides: ["connection"] })
];

const result = composeTraitDescriptors({ input: traits });
```

### `composePipeline(initialValue, ...steps)`

Compone un pipeline de transformaciones secuenciales.

**Parámetros:**
- `initialValue`: any — El valor inicial a procesar
- `steps`: Function[] — Array de funciones de transformación

**Retorna:** any — El valor final procesado

**Ejemplo:**
```ts
import { composePipeline } from "@zuccadev-labs/barrits";

const result = composePipeline(
  rawData,
  (data) => normalize(data),
  (data) => filter(data),
  (data) => rank(data)
);
```

---

## Propiedades del Descriptor de Trait

### TraitDescriptorInput

Propiedades aceptadas por `createTraitDescriptor`:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | string | El nombre único del trait |
| `provides` | string[] | Capacidades que este trait expone a otros traits |
| `consumes` | string[] | Capacidades que este trait requiere de otros traits |
| `state` | string[] | Variables de estado gestionadas por este trait |
| `conflicts` | string[] | Nombres de traits que no pueden coexistir con este |
| `requires` | string[] | Nombres de traits de los que depende (obsoleto, utilizar consumes) |
| `tags` | string[] | Etiquetas de clasificación del trait |
| `runtime` | string | Restricción de runtime objetivo (ej. "node", "deno", "browser") |
| `version` | string | Restricción de versión del trait |
| `stability` | "stable" \| "experimental" \| "deprecated" | Nivel de estabilidad |

### ComposeTraitDescriptorsOptions

Opciones para `composeTraitDescriptors`:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `input` | TraitDescriptor[] | Array de descriptores de trait a componer |
| `conflictStrategy` | TraitConflictStrategy | Estrategia de resolución de conflictos (ver a continuación) |

### TraitConflictStrategy

Define cómo manejar conflictos durante la composición de traits:

| Valor | Descripción |
| :--- | :--- |
| `"error"` | Lanzar un error cuando se detectan conflictos (predeterminado) |
| `"warn"` | Registrar una advertencia pero continuar la composición |
| `"ignore"` | Ignorar conflictos silenciosamente |
| `"replace"` | Reemplazar traits en conflicto con los posteriores |

### ComposedTraitDescriptorsResult

Resultado de la composición de traits:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `provides` | string[] | Todas las capacidades proporcionadas por los traits compuestos |
| `consumes` | string[] | Todas las capacidades consumidas por los traits compuestos |
| `state` | string[] | Todas las variables de estado gestionadas por los traits compuestos |
| `conflicts` | string[] | Todos los conflictos detectados durante la composición |
| `traits` | TraitDescriptor[] | Los descriptores de trait originales |
| `metadata` | Record\<string, any\> | Metadatos adicionales de la composición |

---

## Uso en Configuración de Paquete

Los traits también pueden definirse en la configuración del paquete a través del contrato `contracts` en `barrits.config.ts`:

```ts
// barrits.config.ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  contracts: {
    traits: [
      {
        name: "AuthDomain",
        provides: ["auth-session", "database-adapter"],
        conflicts: ["legacy-adapter"],
        state: ["currentUser", "connectionPool"],
        consumes: ["logger", "config"]
      }
    ]
  }
});
```

Esto es equivalente a definir el trait con JSDoc o `createTraitDescriptor` pero evita modificar los archivos fuente.

---

## Descubrimiento Automático de Traits (Basado en Convenciones)

La plataforma Barrits puede descubrir traits automáticamente siguiendo convenciones, reduciendo la necesidad de llamadas explícitas al descriptor de traits.

### Convención 1: Archivos en la carpeta `traits/`
Cualquier archivo TypeScript o JavaScript ubicado en una carpeta `traits/` (relativa a la raíz del proyecto o al directorio `src/`) se considera automáticamente un trait.

### Convención 2: Archivos `*.trait.ts` o `*.trait.tsx`
Los archivos con la extensión `.trait.ts` o `.trait.tsx` en cualquier parte del árbol fuente se consideran automáticamente traits.

### Funcionamiento

Cuando el descubrimiento automático está habilitado (vía `barrits.config.ts` u opciones de plugin), la plataforma Barrits:

1. Escanea el árbol fuente en busca de archivos que coincidan con las convenciones anteriores.
2. Para cada archivo, recopila:
   - **Provides**: Todas las funciones, clases y constantes exportadas.
   - **Consumes**: Analiza las importaciones para determinar qué capacidades externas se necesitan (puede complementarse con JSDoc `@barrits-consumes`).
   - **State**: Puede declararse vía JSDoc `@barrits-state` o dejarse vacío (se infiere como ninguno).
   - **Name**: Se deriva del nombre del archivo (sin extensión) o puede sobreescribirse con `@barrits-trait { name: "MiTrait" }`.

### Ejemplo

Dado el archivo `src/traits/auth.trait.ts`:

```ts
/**
 * @barrits-trait
 * @barrits-summary Authentication trait
 * @barrits-consumes logger, config
 * @barrits-state sessionToken, user
 */
export function login(username: string, password: string): Promise<User> {
    // implementación
}

export function logout(): void {
    // implementación
}
```

La plataforma Barrits creará automáticamente un descriptor de trait equivalente a:

```ts
createTraitDescriptor({
  name: "auth",
  provides: ["login", "logout"],
  consumes: ["logger", "config"],
  state: ["sessionToken", "user"]
})
```

### Habilitación del Descubrimiento Automático

Para habilitar el descubrimiento automático, agregar al archivo `barrits.config.ts`:

```ts
import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  traitsDiscovery: {
    conventions: [
      "traits/**/*.ts",
      "traits/**/*.tsx",
      "**/*.trait.ts",
      "**/*.trait.tsx"
    ]
  }
});
```

> [!IMPORTANT]
> El descubrimiento automático es opcional y puede combinarse con descriptores de trait manuales.
> Cuando ambas convenciones y descriptores manuales existen para el mismo nombre de trait, se fusionan (con los descriptores manuales teniendo precedencia en caso de conflicto).

---

## Buenas Prácticas

1. **Mantener los traits enfocados**: Cada trait debe representar una única capacidad o responsabilidad cohesiva.
2. **Dependencias explícitas**: Utilizar `consumes` para declarar lo que el trait necesita de otros.
3. **Declarar conflictos**: Utilizar `conflicts` para prevenir que traits incompatibles se compongan juntos.
4. **Gestionar el estado propio**: Utilizar `state` para declarar qué estado administra el trait.
5. **Documentar con JSDoc**: Colocar las definiciones de traits cerca de donde se utilizan y documentar con tags JSDoc.
6. **Aprovechar la composición**: Construir sistemas complejos componiendo traits simples y enfocados.
7. **Versión y estabilidad**: Utilizar `@barrits-version` y `@barrits-stability` para comunicar la madurez.
8. **Restricciones de runtime**: Utilizar `@barrits-runtime` para especificar dónde puede ejecutarse un trait (node, deno, browser).

---

## API Relacionada

- [`defineBarritsPackage`](09a-referencia-de-api-configuracion.md) — Definición de configuración a nivel de paquete
- [`toBarritsAutomationOptions`](09a-referencia-de-api-configuracion.md) — Adaptación de definiciones de paquete a opciones de plugin
- [`parseBuildManifest`](09c-referencia-de-api-consume-y-adapters.md) — Consumo de manifiestos de build
- [`parseWatchSnapshot`](09c-referencia-de-api-consume-y-adapters.md) — Consumo de snapshots de watch

---

[← Referencia de API — Consume y Adapters](09c-referencia-de-api-consume-y-adapters.md) | [Índice](00-indice.md)
