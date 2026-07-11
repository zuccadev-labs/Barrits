import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/**
 * Flat config (ESLint 10 / typescript-eslint v8).
 *
 * Basado en los configs oficiales *type-checked* de typescript-eslint:
 *   - flat/recommended               (eslint:recommended + @typescript-eslint/recommended)
 *   - flat/recommended-type-checked  (reglas que requieren información de tipos)
 *   - flat/stylistic-type-checked     (reglas de estilo que requieren información de tipos)
 *
 * Se habilita el TypeScript Project Service (`parserOptions.projectService`) para que
 * las reglas type-checked resuelvan los tipos sin configurar `project` manualmente.
 *
 * Notas de ingeniería:
 * - `engines`/`env`: `eslint:recommended` es inerte bajo TypeScript porque
 *   `@typescript-eslint/recommended` desactiva `no-undef`; por eso no se replican
 *   `languageOptions.globals` (evita una dependencia nueva de `globals`).
 * - Alcance de lint definido por los scripts `lint`/`lint:fix` (src/barrits + adapters).
 * - Documentado en `docs/investigations/adr/0005-toolchain-modernization-assessment.md`.
 */
export default [
  {
    name: "barrits/ignores",
    ignores: ["**/*.d.ts"],
  },
  ...tsPlugin.configs["flat/recommended"],
  ...tsPlugin.configs["flat/recommended-type-checked"],
  ...tsPlugin.configs["flat/stylistic-type-checked"],
  {
    name: "barrits/project-service",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    name: "barrits/project-overrides",
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            "Enums are discouraged (non-erasable runtime object, reverse-map overhead for numeric enums, incompatible with Node/Bun/Deno type-stripping and --erasableSyntaxOnly). Prefer `as const` objects + derived union types or string-literal unions.",
        },
      ],
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
