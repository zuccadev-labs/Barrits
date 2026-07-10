# ADR 0005: Evaluación de modernización del toolchain (TypeScript 7, ESLint 10, Prettier, Deno)

## Status
Accepted

## Context
El ecosistema liberó **TypeScript 7.0** (compilador nativo Go, *Corsa*, GA 2026-07-08) y **ESLint 10.x** (flat config obligatoria, eliminado `eslintrc`). El SDK `@zuccadev-labs/barrits` se encuentra actualmente con:

- TypeScript pinneado a `^6.0.3` (en `packages/sdk/ts_js/package.json`).
- ESLint `^8.57.0` (root) con config legacy `.eslintrc.cjs`.
- 16 archivos del SDK con formato Prettier desalineado (scope `src/barrits` + `adapters`).
- Ejemplos Deno que requieren `deno test -A --no-check`.

Esta ADR registra la evaluación y las decisiones de adopción incremental, aplicadas con criterio de ingeniería experta (bajo riesgo, sin romper el pipeline).

## Decision
1. **TypeScript 7.0 — DIFERIR.** Mantener el pin `^6.0.3`. TS 6.0 es el *release puente*; TS 7.0 convierte sus defaults en errores duros (`rootDir` → `./`, `types` → `[]`, elimina `target: es5`, `moduleResolution: node`, etc.) y — críticamente — **typescript-eslint aún NO soporta TS ≥ 6.1.0**. El lint del SDK depende de typescript-eslint, por lo que un bump a 7 rompería el pipeline de calidad. Cuando typescript-eslint soporte 7.x (esperado en 7.1), adoptar TS7 nativo para build mediante *side-by-side* (`@typescript/native` + alias `typescript` → `@typescript/typescript6` para el API de lint).
2. **ESLint — MIGRAR config a flat SIN subir de versión.** Se migró `.eslintrc.cjs` → `eslint.config.mjs` fielmente (eslint:recommended + `@typescript-eslint/recommended` + overrides del proyecto) sobre ESLint 8.57 vigente. El bump a ESLint 10.x se difiere hasta actualizar Node a **≥ 20.19** en CI (ESLint 10 lo exige; `engines` del SDK dice `>=18`).
3. **Prettier — APLICAR format.** `prettier --write` a los 16 archivos del SDK (scope `src/barrits` + `adapters`). Completado.
4. **Deno examples `--no-check` — ACEPTAR por diseño.** El SDK utiliza *imports sin extensión* resueltos en build; el type-checker de Deno no puede resolverlos, de ahí `--no-check`. No requiere acción.

## Consequences
### Positive
- ESLint usa flat config, preparado para ESLint 9/10 sin rework adicional.
- `typecheck` y `lint` siguen en verde (0 errores).
- Código del SDK formateado consistentemente (16 archivos).
- Decisiones de adopción de TS7/ESLint 10 documentadas y justificadas, evitando trabajo prematuro y rupturas de CI.

### Negative
- ESLint 8.57 sigue vigente (no se aprovechan aún las 3 reglas nuevas de `eslint:recommended` en 10 ni el JSX reference tracking).
- TS7 no se adopta aún (sin la mejora de 8–12× de rendimiento del compilador nativo).

## Implementation
- `eslint.config.mjs` creado (flat) replicando el comportamiento de `.eslintrc.cjs`.
- Scripts `lint` / `lint:fix` actualizados (se removió `--ext .ts`, inválido en flat config).
- `.eslintrc.cjs` eliminado.
- 16 archivos del SDK re-formateados con Prettier.
- Sin cambios de versión de dependencias (npm bloqueado en este entorno; el bump a ESLint 9/10 queda como seguimiento explícito).

## Related Decisions
- ADR 0001 (Conventional Commits + lint-staged): el lint sigue siendo gate de CI.

## References
- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://eslint.org/docs/latest/use/migrate-to-10.0.0
- https://typescript-eslint.io/users/dependency-versions/
