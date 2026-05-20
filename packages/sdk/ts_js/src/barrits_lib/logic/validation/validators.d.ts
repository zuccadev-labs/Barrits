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
export declare const isEmail: (value: string) => boolean;
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
export declare const isUrl: (value: string) => boolean;
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
export declare const isUuid: (value: string) => boolean;
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
export declare const isIsoDate: (value: string) => boolean;
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
export declare const isIpAddress: (value: string) => boolean;
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
export declare const assertNonNullish: <T>(value: T | null | undefined, label: string) => T;
