/**
 * @module
 * [EN] Single vocabulary for trait capability conflicts, shared by `composeTraitDescriptors`, `mergeTraits` and
 * the `traitConflictStrategy` option of `barrits.config.*`.
 * [ES] Vocabulario único para conflictos de capacidades entre traits, compartido por `composeTraitDescriptors`,
 * `mergeTraits` y la opción `traitConflictStrategy` de `barrits.config.*`.
 */

/**
 * [EN] Canonical conflict strategies, in documentation order.
 * [ES] Estrategias de conflicto canónicas, en orden de documentación.
 */
export const TRAIT_CONFLICT_STRATEGIES = ["throw", "left", "right"] as const;

/**
 * [EN] How a capability key provided by two traits is resolved: `throw` fails, `left` keeps the first provider,
 * `right` lets the last provider win.
 * [ES] Cómo se resuelve una clave de capacidad proporcionada por dos traits: `throw` falla, `left` conserva el
 * primer proveedor, `right` deja ganar al último.
 */
export type TraitConflictStrategy = (typeof TRAIT_CONFLICT_STRATEGIES)[number];

/**
 * [EN] Legacy spellings accepted in `barrits.config.*` for backwards compatibility (`error` → `throw`,
 * `override` and `merge` → `right`). They are normalized away and never appear in a resolved configuration.
 * [ES] Grafías heredadas aceptadas en `barrits.config.*` por compatibilidad (`error` → `throw`, `override` y
 * `merge` → `right`). Se normalizan y nunca aparecen en una configuración resuelta.
 */
export type LegacyTraitConflictStrategy = "error" | "override" | "merge";

/**
 * [EN] Default strategy: fail loudly on the first capability collision.
 * [ES] Estrategia por defecto: fallar de forma visible en la primera colisión de capacidades.
 */
export const DEFAULT_TRAIT_CONFLICT_STRATEGY: TraitConflictStrategy = "throw";

const LEGACY_TRAIT_CONFLICT_STRATEGIES: Readonly<Record<LegacyTraitConflictStrategy, TraitConflictStrategy>> = {
  error: "throw",
  override: "right",
  merge: "right",
};

/**
 * [EN] Whether a value is a canonical conflict strategy.
 * [ES] Indica si un valor es una estrategia de conflicto canónica.
 */
export const isTraitConflictStrategy = (value: unknown): value is TraitConflictStrategy => {
  return typeof value === "string" && (TRAIT_CONFLICT_STRATEGIES as readonly string[]).includes(value);
};

/**
 * [EN] Normalizes a configured strategy to its canonical form. Accepts canonical and legacy spellings; `undefined`
 * yields the default; anything else throws a `TypeError` so a typo in `barrits.config.*` never silently changes
 * how collisions are handled.
 * [ES] Normaliza una estrategia configurada a su forma canónica. Acepta grafías canónicas y heredadas; `undefined`
 * produce el valor por defecto; cualquier otra cosa lanza `TypeError` para que un error tipográfico en
 * `barrits.config.*` nunca cambie en silencio cómo se tratan las colisiones.
 */
export const normalizeTraitConflictStrategy = (value: unknown): TraitConflictStrategy => {
  if (value === undefined) {
    return DEFAULT_TRAIT_CONFLICT_STRATEGY;
  }

  if (isTraitConflictStrategy(value)) {
    return value;
  }

  if (typeof value === "string" && value in LEGACY_TRAIT_CONFLICT_STRATEGIES) {
    return LEGACY_TRAIT_CONFLICT_STRATEGIES[value as LegacyTraitConflictStrategy];
  }

  throw new TypeError(
    `[barrits] Invalid traitConflictStrategy ${JSON.stringify(value)}. Expected one of ${TRAIT_CONFLICT_STRATEGIES.map((strategy) => JSON.stringify(strategy)).join(", ")}.`,
  );
};
