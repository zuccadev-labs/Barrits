/**
 * Converts a Date, timestamp, or string to an ISO 8601 UTC string.
 * @param input - A Date, Unix timestamp in ms, or ISO string to normalize.
 * @returns A normalized ISO 8601 UTC datetime string.
 */
export declare const toIsoString: (input: Date | number | string) => string;

/**
 * Parses an ISO 8601 string into a Date. Returns `null` on failure.
 * @param input - An ISO 8601 datetime string.
 * @returns A valid Date object or `null`.
 */
export declare const fromIsoString: (input: string) => Date | null;

/**
 * Computes the difference in milliseconds between two dates.
 * @param start - The earlier date.
 * @param end - The later date.
 * @returns The difference in milliseconds (end - start).
 */
export declare const diffMs: (start: Date, end: Date) => number;

/**
 * Returns a new Date offset by the specified milliseconds. Does not mutate the input.
 * @param date - The base date.
 * @param milliseconds - Milliseconds to add (negative to subtract).
 * @returns A new Date object.
 */
export declare const addMs: (date: Date, milliseconds: number) => Date;

/**
 * Formats a Date as a locale-aware relative time string (e.g. "2 hours ago").
 * @param date - The target date.
 * @param locale - Optional BCP 47 locale. Defaults to "en".
 * @returns A relative time string.
 */
export declare const toRelativeTime: (date: Date, locale?: string) => string;

/**
 * Aggregated datetime algorithm family.
 */
export declare const datetimeAlgorithms: {
  readonly toIsoString: typeof toIsoString;
  readonly fromIsoString: typeof fromIsoString;
  readonly diffMs: typeof diffMs;
  readonly addMs: typeof addMs;
  readonly toRelativeTime: typeof toRelativeTime;
};
