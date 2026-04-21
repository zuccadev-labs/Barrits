# Ecosistema y Recorridos (Paso a Paso)

Este documento instruye de forma minuciosa y orientada al consumidor final cómo aprovechar el potencial arquitectónico del orquestador Barrits como motor de descubrimiento y orquestación de módulos.

## Pre-requisitos del Consumidor

Barrits asume que el proyecto consumidor delega al SDK la resolución del árbol AST, la recolección de exports y la determinación de visibilidad de módulos internos, eliminando implementaciones manuales propensas a error.

## Paso 1: Configurar el Directorio de Integración

Barrits opera leyendo y consumiendo una carpeta dedicada. El proyecto debe crear una carpeta con nombre `.barrits` o `barrits/` en su directorio de ejecución, o configurar una ruta personalizada en `barrits.config.ts`.

1. Crear la carpeta en el proyecto: `mkdir barrits`
2. El SDK detecta esta convención y aplica lectura *Differential Caching* en 0ms. Todo archivo ubicado en esta ruta o declarado en la configuración queda bajo orquestación determinística.

## Paso 2: Declarar Componentes Mediante Traits (Godoc-style)

Los Traits son contratos semánticos que Barrits resuelve estáticamente sobre el AST, proveyendo trazabilidad estructural sin procesado de expresiones regulares.

Crear el archivo base del módulo en `barrits/index.ts`:

```typescript
import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * @barrits-trait
 *
 * Descriptor de dominio de autenticación backend.
 * Define los contratos de provisión y los recursos en conflicto potencial.
 */
export const authBackendTrait = createTraitDescriptor({
  name: "AuthBackendDomain",
  provides: ["database-adapter", "auth-session"],
  conflicts: ["legacy-adapter"]
});
```

A diferencia de herramientas basadas en análisis de expresiones regulares o linters de importaciones, esta declaración es procesada mediante análisis estático AST nativo, integrándose en el grafo de descubrimiento sin latencia adicional en el pipeline de compilado.

## Paso 3: Consumo del Orquestador

Los adaptadores expuestos por Barrits automatizan la resolución conectándose con el ecosistema del bundler o runtime configurado. Ejemplo en Deno:

```typescript
import { barrits } from "@zuccadev-labs/barrits";

const manifest = await barrits.inspect();
console.log(manifest.traitDescriptors); // Lista de contratos declarados y resueltos
```

Al ejecutar el CLI, el orquestador genera un *Manifest Determinístico* bloqueado mediante `checksum`. Esta firma criptográfica garantiza que entre compilaciones consecutivas ningún componente externo haya alterado la resolución del grafo.

## Paso 4: Prevención de Colisiones de Namespace

En monorepos de alta escala, la colisión de exports entre librerías produce fallos silenciosos difíciles de trazar. Al ejecutar la orquestación, Barrits evalúa los dominios declarados bajo el principio de Responsabilidad Única. Cualquier export que colisione semánticamente genera un diagnóstico explícito indicando el origen exacto de la colisión, sin romper silenciosamente la aplicación.

## Conclusión

La adopción de Barrits no implica reconstruir la capa frontal del proyecto. Permite desacoplar la inteligencia estructural pesada hacia un motor de descubrimiento pre-optimizado y transaccional, habilitando máxima agilidad y trazabilidad organizacional a escala.
