/**
 * Converts a Date object or numeric timestamp to an ISO 8601 string
 * in UTC timezone.
 *
 * This function normalizes all date inputs to the `YYYY-MM-DDTHH:mm:ss.sssZ`
 * format, ensuring consistent serialization across services and storage layers.
 *
 * @param input - A Date object, numeric Unix timestamp in milliseconds,
 *   or an ISO 8601 string to normalize.
 * @returns A normalized ISO 8601 UTC datetime string.
 * @throws RangeError if the input produces an invalid Date.
 *
 * @example
 * ```ts
 * import { toIsoString } from "@aspect/barrits";
 *
 * toIsoString(new Date("2026-04-21T14:30:00Z"));
 * // "2026-04-21T14:30:00.000Z"
 *
 * toIsoString(1776960600000);
 * // Equivalent ISO string for that timestamp
 * ```
 */
export const toIsoString = (input: Date | number | string): string => {
  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid date input: ${String(input)}`);
  }

  return date.toISOString();
};

/**
 * Parses an ISO 8601 string into a Date object.
 *
 * Returns `null` instead of an invalid Date when the input string
 * cannot be parsed. This design prevents the propagation of `Invalid Date`
 * objects through service layers.
 *
 * @param input - An ISO 8601 datetime string.
 * @returns A valid Date object, or `null` if parsing fails.
 *
 * @example
 * ```ts
 * import { fromIsoString } from "@aspect/barrits";
 *
 * const date = fromIsoString("2026-04-21T14:30:00.000Z");
 * // Date object or null
 * ```
 */
export const fromIsoString = (input: string): Date | null => {
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Computes the difference in milliseconds between two dates.
 *
 * The result is always `end - start`, which yields a positive value
 * when `end` is after `start`.
 *
 * @param start - The earlier date.
 * @param end - The later date.
 * @returns The difference in milliseconds.
 *
 * @example
 * ```ts
 * import { diffMs } from "@aspect/barrits";
 *
 * const start = new Date("2026-04-21T00:00:00Z");
 * const end = new Date("2026-04-22T00:00:00Z");
 * diffMs(start, end); // 86400000 (24 hours)
 * ```
 */
export const diffMs = (start: Date, end: Date): number => {
  return end.getTime() - start.getTime();
};

/**
 * Returns a new Date that is `milliseconds` ahead of (or behind) the
 * provided date. The original date is not mutated.
 *
 * @param date - The base date.
 * @param milliseconds - Milliseconds to add. Negative values subtract.
 * @returns A new Date object offset by the specified milliseconds.
 *
 * @example
 * ```ts
 * import { addMs } from "@aspect/barrits";
 *
 * const now = new Date("2026-04-21T14:30:00Z");
 * const later = addMs(now, 3600000); // 1 hour later
 * // "2026-04-21T15:30:00.000Z"
 * ```
 */
export const addMs = (date: Date, milliseconds: number): Date => {
  return new Date(date.getTime() + milliseconds);
};

/** Time unit divisors used for relative time formatting. */
const TIME_DIVISIONS: readonly { readonly amount: number; readonly unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.345, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/**
 * Formats a Date as a human-readable relative time string (e.g., "2 hours ago",
 * "in 3 days").
 *
 * This function uses `Intl.RelativeTimeFormat` for locale-aware formatting
 * and is compatible with all major runtimes. The `locale` parameter defaults
 * to `"en"` but accepts any IETF BCP 47 language tag.
 *
 * @param date - The target date.
 * @param locale - Optional BCP 47 locale string. Defaults to `"en"`.
 * @returns A locale-aware relative time string.
 *
 * @example
 * ```ts
 * import { toRelativeTime } from "@aspect/barrits";
 *
 * const twoHoursAgo = new Date(Date.now() - 7200000);
 * toRelativeTime(twoHoursAgo);       // "2 hours ago"
 * toRelativeTime(twoHoursAgo, "es"); // "hace 2 horas"
 * ```
 */
export const toRelativeTime = (date: Date, locale: string = "en"): string => {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "years");
};
