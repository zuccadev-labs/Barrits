---
name: barrits-jsdoc-authoring
description: 'Use this skill when creating or refactoring functions in Barrits that need high-quality JSDoc/TSdoc contracts: params, return types, invariants, side effects, examples, and runtime notes.'
argument-hint: 'Provide function name and module path.'
---

# Barrits JSDoc Authoring

## When To Use
Use this skill when adding or changing public or reusable internal functions.

## Documentation Standard
For each documented function, include:
- Purpose in one clear sentence.
- `@param` for each argument with constraints.
- `@returns` semantics, not only type.
- `@throws` when function can fail.
- Side effects or IO notes if applicable.
- Runtime notes when behavior differs in Node/Deno/Bun.
- Minimal usage example for public API.

## Authoring Procedure
1. Inspect function behavior and edge cases in implementation.
2. Write doc block before function declaration.
3. Keep wording deterministic and testable.
4. Align docs with actual exported types.
5. Validate no stale docs after refactor.

## Quality Checks
- Docs reflect real runtime behavior.
- Parameter names in docs match implementation.
- Examples use current package scope `@zuccadev-labs/barrits`.

## Output Template
```markdown
## JSDoc Updated
- Function and module path.

## Contract Notes
- Inputs, outputs, errors, side effects.

## Example
- Minimal usage snippet.
```
