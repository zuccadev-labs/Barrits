/**
 * @module
 * [EN] Barrits standard library: algorithm families plus string, hashing, validation, datetime and resilience
 * utilities. Every symbol is runtime-agnostic (no filesystem, process or DOM access).
 * [ES] Librería estándar de Barrits: familias de algoritmos más utilidades de strings, hashing, validación, fechas y
 * resiliencia. Todos los símbolos son agnósticos del runtime (sin acceso a filesystem, proceso ni DOM).
 */
import { algorithms } from "./algorithms/index";
import { stringAlgorithms } from "./strings/index";
import { hashingAlgorithms } from "./hashing/index";
import { validationAlgorithms } from "./validation/index";
import { datetimeAlgorithms } from "./datetime/index";
import { resilienceAlgorithms } from "./resilience/index";

export * from "./algorithms/index";
export * from "./strings/index";
export * from "./hashing/index";
export * from "./validation/index";
export * from "./datetime/index";
export * from "./resilience/index";
export * from "./arithmetic/index";

/**
 * [EN] Algorithm and utility families grouped by domain (`algorithms`, `strings`, `hashing`, `validation`,
 * `datetime`, `resilience`). Use it when you prefer navigating by family instead of flat imports.
 * [ES] Familias de algoritmos y utilidades agrupadas por dominio (`algorithms`, `strings`, `hashing`, `validation`,
 * `datetime`, `resilience`). Úsalo cuando prefieras navegar por familia en lugar de imports planos.
 */
export const logicFamilies = {
  /** [EN] Computational algorithms (aggregate, collection, graph, search, selection, sort, timeseries, window). [ES] Algoritmos computacionales (aggregate, collection, graph, search, selection, sort, timeseries, window). */
  algorithms,
  /** [EN] String manipulation (capitalize, slugify, truncate, accent-insensitive). [ES] Manipulación de strings (capitalize, slugify, truncate, insensible a acentos). */
  strings: stringAlgorithms,
  /** [EN] Hashing and integrity (SHA-256, MurmurHash3, deterministic JSON). [ES] Hashing e integridad (SHA-256, MurmurHash3, JSON determinista). */
  hashing: hashingAlgorithms,
  /** [EN] Validation and assertion guards (email, URL, UUID, ISO date, IP address). [ES] Validación y guardas de aserción (email, URL, UUID, fecha ISO, dirección IP). */
  validation: validationAlgorithms,
  /** [EN] Date and time (ISO 8601 serialize/parse, diff, add, relative). [ES] Fecha y hora (serializar/parsear ISO 8601, diff, add, relativo). */
  datetime: datetimeAlgorithms,
  /** [EN] Resilience patterns (retry with backoff, timeout, circuit breaker). [ES] Patrones de resiliencia (reintento con backoff, timeout, circuit breaker). */
  resilience: resilienceAlgorithms,
} as const;
