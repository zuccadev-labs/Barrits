/**
 * Validates whether the provided string conforms to the RFC 5322 simplified
 * email address format.
 *
 * This implementation covers the practical subset of email formats encountered
 * in production systems. It intentionally excludes quoted-string local parts
 * and IP-literal domain parts, which are valid per RFC but virtually never
 * used in real-world applications.
 *
 * @param value - The string to validate.
 * @returns `true` if the string represents a valid email address.
 *
 * @example
 * ```ts
 * import { isEmail } from "@zuccadev-labs/barrits";
 *
 * isEmail("admin@example.com");      // true
 * isEmail("user+tag@corp.co.uk");    // true
 * isEmail("not-an-email");           // false
 * isEmail("@missing-local.com");     // false
 * ```
 */
export const isEmail = (value: string): boolean => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/u.test(value);
};

/**
 * Validates whether the provided string is a well-formed URL with an
 * `http` or `https` scheme.
 *
 * The validation leverages the native `URL` constructor, which implements
 * the WHATWG URL Standard. This ensures consistent behavior across all
 * JavaScript runtimes.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid HTTP or HTTPS URL.
 *
 * @example
 * ```ts
 * import { isUrl } from "@zuccadev-labs/barrits";
 *
 * isUrl("https://api.example.com/v2");  // true
 * isUrl("ftp://files.corp.net");        // false (not http/https)
 * isUrl("not a url");                   // false
 * ```
 */
export const isUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Validates whether the provided string conforms to the UUID v4 format
 * as defined in RFC 4122. Hexadecimal digits are accepted in either case;
 * the version nibble must be `4` and the variant nibble in the `[8-b]` range.
 * Other UUID versions (v1, v7...) are intentionally rejected.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid UUID v4.
 *
 * @example
 * ```ts
 * import { isUuid } from "@zuccadev-labs/barrits";
 *
 * isUuid("550e8400-e29b-41d4-a716-446655440000"); // true
 * isUuid("not-a-uuid");                           // false
 * ```
 */
export const isUuid = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value);
};

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))?)?$/u;

const daysInMonth = (year: number, month: number): number => {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
};

/**
 * Validates whether the provided string is a real ISO 8601 calendar date (`YYYY-MM-DD`) or datetime
 * (`YYYY-MM-DDTHH:mm:ss[.sss][Z|±HH:mm]`). Unlike `Date.parse`, which silently normalizes overflowing
 * components (`2026-02-30` becomes March 2nd), every component is range-checked: month `01-12`, day within
 * the month (leap years included), hour `00-23`, minute/second `00-59`, and offset hours/minutes in range.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid ISO 8601 date or datetime.
 *
 * @example
 * ```ts
 * import { isIsoDate } from "@zuccadev-labs/barrits";
 *
 * isIsoDate("2026-04-21");                    // true
 * isIsoDate("2026-04-21T14:30:00.000Z");      // true
 * isIsoDate("2026-02-30");                    // false (February has no 30th)
 * isIsoDate("21/04/2026");                    // false
 * ```
 */
export const isIsoDate = (value: string): boolean => {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const [, year, month, day, hour, minute, second, offsetHours, offsetMinutes] = match.map((part) => (part === undefined ? undefined : Number(part)));
  const monthValue = month!;
  const dayValue = day!;

  if (monthValue < 1 || monthValue > 12 || dayValue < 1 || dayValue > daysInMonth(year!, monthValue)) {
    return false;
  }

  if (hour !== undefined && (hour > 23 || (minute!) > 59 || (second!) > 59)) {
    return false;
  }

  if (offsetHours !== undefined && (offsetHours > 23 || (offsetMinutes!) > 59)) {
    return false;
  }

  return true;
};

/**
 * Validates whether the provided string is a valid IPv4 or IPv6 address.
 *
 * IPv4 validation ensures each octet is in the `0–255` range.
 * IPv6 validation accepts the standard colon-separated hexadecimal format,
 * including the `::` shorthand for consecutive zero groups.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid IP address.
 *
 * @example
 * ```ts
 * import { isIpAddress } from "@zuccadev-labs/barrits";
 *
 * isIpAddress("192.168.1.1");    // true
 * isIpAddress("::1");            // true
 * isIpAddress("999.999.999.999"); // false
 * ```
 */
export const isIpAddress = (value: string): boolean => {
  return isIpv4(value) || isIpv6(value);
};

const isIpv4 = (value: string): boolean => {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d{1,3}$/u.test(part)) return false;
    const num = Number.parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

const isIpv6 = (value: string): boolean => {
  return /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/u.test(value);
};

/**
 * Asserts that the provided value is neither `null` nor `undefined`.
 *
 * This guard function is designed for fail-fast validation at service
 * boundaries. When the assertion fails, it throws a `TypeError` with
 * the specified label for traceability in error logs.
 *
 * @typeParam T - The expected non-nullish type.
 * @param value - The value to assert.
 * @param label - A human-readable label included in the error message.
 * @returns The original value, narrowed to exclude `null` and `undefined`.
 * @throws TypeError if the value is `null` or `undefined`.
 *
 * @example
 * ```ts
 * import { assertNonNullish } from "@zuccadev-labs/barrits";
 *
 * const userId = request.headers.get("x-user-id");
 * const validId = assertNonNullish(userId, "x-user-id header");
 * // If userId is null, throws: TypeError: Expected non-nullish value for "x-user-id header"
 * ```
 */
export const assertNonNullish = <T>(value: T | null | undefined, label: string): T => {
  if (value === null || value === undefined) {
    throw new TypeError(`Expected non-nullish value for "${label}"`);
  }

  return value;
};
