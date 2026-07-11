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
1. **TypeScript 7.0 — DIFERIR (confirmado por docs oficiales).** Mantener el pin `^6.0.3`. TS 6.0 es el *release puente*; TS 7.0 convierte sus defaults en errores duros (`rootDir` → `./`, `types` → `[]`, elimina `target: es5`, `moduleResolution: node`, etc.) y — críticamente — **typescript-eslint 8.63.0 (última versión) declara peer `typescript: '>=4.8.4 <6.1.0'`**, por lo que TS ≥ 6.1.0 no es aceptado. TS 7.0 (GA 2026-07-08) además **no expone un API estable hasta 7.1** (el compilador nativo Go no lanza API en 7.0), así que typescript-eslint debe seguir usando el alias `typescript` → `@typescript/typescript6`. Un bump a 7 rompería el pipeline de calidad. Cuando typescript-eslint soporte 7.x (post-7.1), adoptar TS7 nativo para build mediante *side-by-side* (`@typescript/native` + alias `typescript` → `@typescript/typescript6` para el API de lint).
2. **ESLint — MIGRAR a flat Y subir a 10.7.0.** Se migró `.eslintrc.cjs` → `eslint.config.mjs` (eslint:recommended + `@typescript-eslint/recommended` + overrides del proyecto). ESLint se actualizó a **10.7.0**; el requisito de Node **≥ 20.19** ya se cumple (local v24.16.0, CI Node 22/24), por lo que la migración es segura en ambos entornos. `eslint.config.mjs` añadió `ignores` (reemplaza el ya no soportado `.eslintignore`).
3. **Prettier — APLICAR format.** `prettier --write` a los 16 archivos del SDK (scope `src/barrits` + `adapters`). Completado.
4. **Deno examples `--no-check` — ACEPTAR por diseño.** El SDK utiliza *imports sin extensión* resueltos en build; el type-checker de Deno no puede resolverlos, de ahí `--no-check`. No requiere acción.
5. **typescript-eslint best practices — ENFORCE.** Sobre la base de la documentación oficial (typescript-eslint.io), se endurecen las reglas del flat config: `@typescript-eslint/no-explicit-any: "error"` (era `warn`), `@typescript-eslint/consistent-type-imports: "error"` (habilitado; permite `import()` dinámicos con `disallowTypeAnnotations: false`), y **ban de enums a nivel proyecto** vía `no-restricted-syntax` (selector `TSEnumDeclaration`, mensaje con rationale de erasabilidad). El SDK **no declara ningún `enum`** (audit estricto: 0 coincidencias en `src`/`adapters`/`tests`); usa `Set<string>` (`DISCOVERY_STRATEGIES`, `FILE_MODES`, `SOURCE_LAYERS`, `BINDING_KINDS`, `TRAIT_FACTORIES`) y uniones / `as const` — precisamente la alternativa recomendada. El ban previene regresiones y alinea el repo con la erasabilidad que exige la era TS7 (`--erasableSyntaxOnly`, type-stripping de Node/Bun/Deno). El codebase ya es `strict`, `verbatimModuleSyntax` y `isolatedModules`, y está libre de `any`/`@ts-ignore`, por lo que estas reglas no introducen violaciones nuevas.

## Consequences
### Positive
- ESLint migrado a **flat config sobre 10.7.0** (no requiere rework adicional para 9/10).
- `typecheck` y `lint` en verde (0 errores / 0 warnings con `--max-warnings 0`).
- Código del SDK formateado consistentemente (16 archivos, Prettier 3.9.5).
- **Mejores prácticas typescript-eslint enforceadas**: ban de enums (`no-restricted-syntax`), `no-explicit-any: error`, `consistent-type-imports: error`. El SDK ya era conforme (0 enums, 0 `any`, `strict`/`verbatimModuleSyntax`/`isolatedModules`), por lo que el endurecimiento no introduce violaciones.
- TS7/ESLint 10 decisiones documentadas y confirmadas contra docs oficiales.

### Negative
- **TS7 no se adopta aún** (typescript-eslint 8.63.0 aún pinnea `typescript <6.1.0`; TS 7.0 no expone API hasta 7.1). Se difiere con puente `@typescript/typescript6` documentado.
- El configset **type-checked** de typescript-eslint (`recommendedTypeChecked` / `strictTypeChecked` + `parserOptions.projectService`) aún no se adopta; queda como fase siguiente recomendada (el codebase limpio lo hace de bajo riesgo).

## Implementation
- `eslint.config.mjs` creado (flat) replicando el comportamiento de `.eslintrc.cjs`; migrado a ESLint 10.7.0 con `ignores` (reemplaza `.eslintignore`).
- Scripts `lint` / `lint:fix` actualizados (se removió `--ext .ts`, inválido en flat config).
- `.eslintrc.cjs` y `.eslintignore` eliminados.
- 16 archivos del SDK re-formateados con Prettier (3.9.5).
- Dependencias de dev actualizadas a latest (ESLint 10.7.0, `@typescript-eslint/*` 8.63.0, `@eslint/js` 10.0.1, Prettier 3.9.5, etc.; TypeScript retenido en 6.0.3).
- Reglas endurecidas: `no-explicit-any: error`, `consistent-type-imports: error`, `no-restricted-syntax` (ban de `TSEnumDeclaration`).

## Enum Performance Analysis (best-practice rationale)
La documentación oficial (typescript-eslint.io y TypeScript Handbook) **no depreca formalmente los enums** (no existe regla `no-enum`; proposal #561 rechazada), pero la postura de la era TS7 favorece la **erasabilidad**: `--erasableSyntaxOnly` y el type-stripping de Node/Bun/Deno tratan `enum`/`namespace` como errores. El matiz de typescript-eslint: *"eviten los enums numéricos; los string enums son aceptables"*.

| Variante | Emit / runtime | Bundle / tree-shaking | Erasable (TS7/Node/Deno) |
|---|---|---|---|
| Numeric enum | IIFE + **reverse mapping** (`key↔value`) | Mayor huella; objeto real no tree-shakeable | ❌ No |
| String enum | Objeto runtime (solo `key→value`) | Menor que numérico, pero no erasable | ❌ No |
| `const enum` | **Inlined** en sitio de uso | Mejor bundle, pero rompe `isolatedModules`/type-stripping | ❌ No |
| `as const` + `typeof …[keyof …]` | Solo el literal del objeto | Tree-shakeable, valores inlinables | ✅ Sí |
| Unión de string literals | **Erasada totalmente** | Coste cero en runtime | ✅ Sí |

**Conclusión para este repo:** el SDK ya aplica la mejor práctica (0 `enum`; usa `Set<string>` y uniones/`as const`). El ban de enums vía `no-restricted-syntax` hace que esta decisión sea *enforceable* y protege contra regresiones, además de garantizar compatibilidad con el type-stripping de los runtimes modernos (Node 22+, Bun, Deno) y con `verbatimModuleSyntax`/`isolatedModules` ya habilitados.

## Related Decisions
- ADR 0001 (Conventional Commits + lint-staged): el lint sigue siendo gate de CI.

## References
- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://eslint.org/docs/latest/use/migrate-to-10.0.0
- https://typescript-eslint.io/users/dependency-versions/
- https://typescript-eslint.io/troubleshooting/faqs/general/ (ban de enums vía `no-restricted-syntax` `TSEnumDeclaration`)
- https://typescript-eslint.io/rules/no-explicit-any/
- https://typescript-eslint.io/rules/consistent-type-imports/
- https://typescript-eslint.io/users/configs (recommended / recommendedTypeChecked / strict / stylistic)
- https://www.typescriptlang.org/docs/handbook/enums.html ("Objects vs Enums" — `as const` + union)
- https://github.com/typescript-eslint/typescript-eslint/issues/561 (rechazo de regla `no-enum`)
