/**
 * @module
 * Date and time manipulation utilities.
 *
 * This module provides immutable, timezone-aware operations for ISO 8601
 * datetime handling. All functions produce new Date objects rather than
 * mutating inputs, following the principle of referential transparency.
 *
 * - `toIsoString` — Normalizes any date input to ISO 8601 UTC.
 * - `fromIsoString` — Safe ISO 8601 parsing with null-safety.
 * - `diffMs` — Computes millisecond difference between dates.
 * - `addMs` — Immutable millisecond offset arithmetic.
 * - `toRelativeTime` — Locale-aware relative formatting ("2 hours ago").
 */

export { toIsoString, fromIsoString, diffMs, addMs, toRelativeTime } from "./operations";

import { toIsoString, fromIsoString, diffMs, addMs, toRelativeTime } from "./operations";

/**
 * Aggregated datetime algorithm family.
 *
 * Provides a unified namespace for all temporal operations used in
 * timestamp management, scheduling, and audit trail formatting.
 */
export const datetimeAlgorithms = {
  /** Normalizes date input to ISO 8601 UTC string. */
  toIsoString,
  /** Parses ISO 8601 string to Date with null-safety. */
  fromIsoString,
  /** Computes millisecond difference between two dates. */
  diffMs,
  /** Returns a new Date offset by the specified milliseconds. */
  addMs,
  /** Formats a Date as a locale-aware relative time string. */
  toRelativeTime,
} as const;
