# Guía de Migración: 0.1.x → 0.2.x

## Resumen

La versión `0.2.0` expande la superficie de API pública de `@zuccadev-labs/barrits` con 11 funciones recién expuestas en los dominios de resiliencia, hashing y datetime. También introduce soporte para el runtime Bun, un espacio de nombres `logic` completamente poblado y un directorio de declaraciones consolidado. No se elimina ninguna importación existente, pero los consumidores deben revisar los siguientes cambios antes de actualizar.

**Nivel de esfuerzo de migración**: Bajo. La mayoría de los consumidores no requieren cambios obligatorios en el código. Revisar las secciones 2 y 5 para casos extremos.

---

## 1. Nuevas Exportaciones Planas — Resiliencia, Hashing, Datetime

**Contexto**: Las utilidades de resiliencia (`retryWithBackoff`, `withTimeout`, `createCircuitBreaker`), hashing (`sha256Hex`, `murmurHash3`, `deterministicStringify`) y datetime (`toIsoString`, `fromIsoString`, `diffMs`, `addMs`, `toRelativeTime`) estaban disponibles anteriormente solo como módulos internos. Ahora se re-exportan completamente a través de `@zuccadev-labs/barrits`.

**Impacto**: Aditivo. Las importaciones existentes no se ven afectadas.

```typescript
// 0.1.x — NO disponible desde el punto de entrada público
// (requería importación profunda a rutas internas)

// 0.2.x — Disponible directamente
import {
  retryWithBackoff,
  createCircuitBreaker,
  sha256Hex,
  murmurHash3,
  deterministicStringify,
  toIsoString,
  fromIsoString,
  diffMs,
  addMs,
  toRelativeTime,
} from "@zuccadev-labs/barrits";
```

**Migración**: No requiere acción a menos que desee reemplazar importaciones internas profundas con el punto de entrada público.

---

## 2. Espacio de Nombres `logic` — Ahora Completo

**Contexto**: El objeto de conveniencia `logic` (accesible mediante `barrits.logic`, `brt.logic`, o `import { logic }`) no incluía las 11 funciones de resiliencia/hashing/datetime. Ahora están incluidas.

```typescript
// 0.1.x — logic.retryWithBackoff === undefined (ausente)
// 0.2.x — logic.retryWithBackoff === [Function: retryWithBackoff]

import { logic } from "@zuccadev-labs/barrits";
logic.retryWithBackoff;   // ✅ Ahora definido
logic.sha256Hex;          // ✅ Ahora definido
logic.toIsoString;        // ✅ Ahora definido
```

**Impacto**: Aditivo. `logic` ahora tiene 11 propiedades adicionales. Si su código itera sobre `Object.keys(logic)` o propaga el objeto, la salida incluirá estas nuevas entradas. Es poco probable que cause problemas, pero debe revisarse si serializa, compara o genera instantáneas del objeto `logic`.

---

## 3. Soporte para Runtime Bun

**Contexto**: `BarritsRuntimeKind` ahora incluye `"bun"`. Una nueva subruta `@zuccadev-labs/barrits/bun` proporciona un adaptador específico para Bun.

```typescript
// 0.2.x — Nueva importación de subruta
import { runBunCli } from "@zuccadev-labs/barrits/bun";
```

**Impacto**: Aditivo. No se requiere migración a menos que utilice validación estricta de tipos de runtime y desee permitir `"bun"`.

---

## 4. `createOperationalShowcase` Asíncrona (Solo Example-Bun)

**Contexto**: La función `createOperationalShowcase` utilizada en los ejemplos de `example-bun` está declarada como `async` para soportar `createResilienceExamples`. Esto no forma parte de la superficie pública del SDK principal.

**Impacto**: Si copió o referenció esta función de los ejemplos de bun, asegúrese de que las llamadas usen `await`.

```typescript
// Si importó o replicó este patrón:
// 0.1.x (si existía) — const result = createOperationalShowcase();
// 0.2.x — const result = await createOperationalShowcase();
```

---

## 5. Directorio de Declaraciones de Tipo

**Contexto**: El `declarationDir` en `tsconfig.json` se ha cambiado a `"dist"`. Anteriormente, las declaraciones de tipo (`.d.ts`) se generaban junto a los archivos fuente en `src/` y `adapters/`. Ahora residen en `dist/`.

**Impacto**: Potencialmente rupturista — **solo si** su cadena de herramientas o IDE depende de archivos `.d.ts` ubicados dentro de `src/` o `adapters/`. Esto puede afectar:

- Configuraciones de TypeDoc o extractores de API que apuntan a `src/**/*.d.ts`
- Referencias de espacios de trabajo en monorepos que resuelven tipos desde directorios fuente
- Pipelines personalizados de generación de tipos

**Migración**:

```jsonc
// Si referencia rutas .d.ts directamente, actualice a dist/:
// Antes: "packages/sdk/ts_js/src/**/*.d.ts"
// Después: "packages/sdk/ts_js/dist/**/*.d.ts"
```

Puede verificar la resolución de tipos ejecutando:

```bash
npx tsc --noEmit --project packages/sdk/ts_js/tsconfig.json
```

Si no encuentra errores, su cadena de herramientas ya es compatible.

---

## 6. Deprecaciones y Eliminaciones

**No se elimina ni depreca nada en 0.2.0.** Todas las exportaciones previamente disponibles siguen estando disponibles. Los cambios son estrictamente aditivos o estructurales.

---

## Resumen de Cambios

| Área | Cambio | Tipo |
|------|--------|------|
| Exportaciones planas (resiliencia, hashing, datetime) | 11 nuevas funciones disponibles desde `@zuccadev-labs/barrits` | 🟢 Aditivo |
| Espacio de nombres `logic` | 11 funciones faltantes añadidas al objeto `logic` | 🟢 Aditivo |
| Runtime Bun | Nueva variante `BarritsRuntimeKind` + subruta `@zuccadev-labs/barrits/bun` | 🟢 Aditivo |
| `createOperationalShowcase` | Marcada como `async` (solo example-bun) | 🟡 Informativo |
| `declarationDir` | Cambiado a `"dist"` | 🟡 Verificar si su cadena de herramientas referencia `src/**/*.d.ts` |

## Reversión

Para revertir a `0.1.x`:

```bash
npm install @zuccadev-labs/barrits@0.1.9
```

No se requiere migración de datos ni cambios de estado — esta es una librería sin estado.
