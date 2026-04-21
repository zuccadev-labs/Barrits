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
/**
 * Aggregated datetime algorithm family.
 *
 * Provides a unified namespace for all temporal operations used in
 * timestamp management, scheduling, and audit trail formatting.
 */
export declare const datetimeAlgorithms: {
    /** Normalizes date input to ISO 8601 UTC string. */
    readonly toIsoString: (input: Date | number | string) => string;
    /** Parses ISO 8601 string to Date with null-safety. */
    readonly fromIsoString: (input: string) => Date | null;
    /** Computes millisecond difference between two dates. */
    readonly diffMs: (start: Date, end: Date) => number;
    /** Returns a new Date offset by the specified milliseconds. */
    readonly addMs: (date: Date, milliseconds: number) => Date;
    /** Formats a Date as a locale-aware relative time string. */
    readonly toRelativeTime: (date: Date, locale?: string) => string;
};
