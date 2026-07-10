import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/**
 * Flat config (ESLint 8.57+ / 9 / 10).
 *
 * Migración desde `.eslintrc.cjs` (legacy) hacia flat config, manteniendo el
 * mismo comportamiento efectivo del proyecto:
 *   - `eslint:recommended`
 *   - `@typescript-eslint/recommended`
 *   - overrides de reglas del equipo
 *
 * Notas de ingeniería:
 * - `env: { node, es2020, jest }` del eslintrc es inerte bajo TypeScript porque
 *   `@typescript-eslint/recommended` desactiva `no-undef`; por eso no se replica
 *   como `languageOptions.globals` (evita una dependencia nueva de `globals`).
 * - El alcance de lint lo definen los scripts `lint`/`lint:fix` (src/barrits + adapters).
 */
export default [
  {
    name: "barrits/ignores",
    ignores: ["**/*.d.ts"],
  },
  js.configs.recommended,
  {
    name: "typescript-eslint/base",
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
  },
  {
    name: "typescript-eslint/eslint-recommended",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    rules: {
      "constructor-super": "off",
      "getter-return": "off",
      "no-class-assign": "off",
      "no-const-assign": "off",
      "no-dupe-args": "off",
      "no-dupe-class-members": "off",
      "no-dupe-keys": "off",
      "no-func-assign": "off",
      "no-import-assign": "off",
      "no-new-native-nonconstructor": "off",
      "no-new-symbol": "off",
      "no-obj-calls": "off",
      "no-redeclare": "off",
      "no-setter-return": "off",
      "no-this-before-super": "off",
      "no-undef": "off",
      "no-unreachable": "off",
      "no-unsafe-negation": "off",
      "no-var": "error",
      "no-with": "off",
      "prefer-const": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
    },
  },
  {
    name: "typescript-eslint/recommended",
    rules: {
      "@typescript-eslint/ban-ts-comment": "error",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": "error",
    },
  },
  {
    name: "barrits/project-overrides",
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
