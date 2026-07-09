---
name: barrits-jsdoc-authoring
description: Use this skill when writing or reviewing JSDoc comments in the Barrits SDK. Covers bilingual [EN]/[ES] conventions, @module, @param, @returns, @barrits-* annotations, and trait descriptors.
opencode_skill: .opencode/skills/jsdoc-authoring/skill.jsonc
---

# Barrits JSDoc Authoring

## When To Use

Apply this skill when:
- Adding a new exported function, type, or module to the SDK
- Reviewing JSDoc coverage on a pull request
- Adding `@barrits-*` annotations for trait discovery
- Writing bilingual documentation for API surfaces

## JSDoc Standards

### Module-Level (`@module`)

Every source file that exports symbols must have a `@module` JSDoc at the top:

```typescript
/**
 * @module
 * [EN] Short description of the module's purpose.
 * [ES] Descripción breve del propósito del módulo.
 */
```

### Exported Functions

```typescript
/**
 * [EN] Description of what the function does. Use active voice.
 * [ES] Descripción de lo que hace la función. Use voz activa.
 *
 * @param input - [EN] Description of parameter. [ES] Descripción del parámetro.
 * @param options - [EN] Optional configuration. [ES] Configuración opcional.
 * @returns [EN] Description of return value. [ES] Descripción del valor de retorno.
 */
export function someFunction(input: string, options?: Options): Result;
```

### Types and Interfaces

```typescript
/**
 * [EN] Configuration options for the Barrits package-first discovery.
 * [ES] Opciones de configuración para el descubrimiento package-first de Barrits.
 */
export interface BarritsPackageOptions {
  /** [EN] Absolute path to the project root. [ES] Ruta absoluta a la raíz del proyecto. */
  projectRoot: string;
}
```

## @barrits-* Annotations

The AST crawler discovers traits via JSDoc annotations. These annotations are essential for the discovery system:

```typescript
/**
 * @barrits-trait
 * @barrits-provides auth-session
 * @barrits-consumes user-repository
 */
export const authTrait = createTraitDescriptor({
  name: "AuthDomain",
  provides: ["auth-session"],
  consumes: ["user-repository"],
});
```

| Annotation | Required | Purpose |
|:---|---|:---|
| `@barrits-trait` | ✅ | Marks a symbol as a trait descriptor |
| `@barrits-provides <name>` | ✅ | Declares what capability the trait provides |
| `@barrits-consumes <name>` | Optional | Declares what capability the trait depends on |

## Conventions

- **Bilingual order**: Always `[EN]` first, then `[ES]` — consistently across all files
- **Line length**: Keep descriptions under 120 characters per line
- **No default exports**: Only named exports; JSDoc attaches to the named symbol
- **@param names**: Must match the TypeScript parameter name exactly
- **@returns**: Omit if the function returns `void`
- **Periods**: End every description with a period (`.`)
- **Active voice**: "Builds the manifest" not "The manifest is built"

## Validation

```bash
# TypeScript validates no undocumented public API
npm run typecheck

# ESLint catches basic JSDoc issues
npm run lint
```

## References

- `docs/development/EN/packages/ts_js/04-jsdoc-and-documentation-standards.md` — Full JSDoc standards document
- `packages/sdk/ts_js/src/barrits/traits/` — Trait implementation reference
- `packages/sdk/ts_js/examples/` — Example trait usage patterns

