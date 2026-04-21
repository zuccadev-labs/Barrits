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
 * import { isEmail } from "@aspect/barrits";
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
 * import { isUrl } from "@aspect/barrits";
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
 * as defined in RFC 4122.
 *
 * The pattern accepts lowercase hexadecimal characters with the version
 * nibble fixed to `4` and the variant nibble in the `[8-b]` range.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid UUID v4.
 *
 * @example
 * ```ts
 * import { isUuid } from "@aspect/barrits";
 *
 * isUuid("550e8400-e29b-41d4-a716-446655440000"); // true
 * isUuid("not-a-uuid");                           // false
 * ```
 */
export const isUuid = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value);
};

/**
 * Validates whether the provided string conforms to the ISO 8601 date
 * format (`YYYY-MM-DD` or full datetime with timezone offset).
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid ISO 8601 date or datetime.
 *
 * @example
 * ```ts
 * import { isIsoDate } from "@aspect/barrits";
 *
 * isIsoDate("2026-04-21");                    // true
 * isIsoDate("2026-04-21T14:30:00.000Z");      // true
 * isIsoDate("21/04/2026");                    // false
 * ```
 */
export const isIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/u.test(value)) {
    return false;
  }

  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
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
 * import { isIpAddress } from "@aspect/barrits";
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
 * import { assertNonNullish } from "@aspect/barrits";
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
