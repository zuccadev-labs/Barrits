/**
 * Validates RFC 5322 simplified email address format.
 * @param value - The string to validate.
 * @returns `true` if the string represents a valid email address.
 */
export declare const isEmail: (value: string) => boolean;

/**
 * Validates a well-formed URL with HTTP or HTTPS scheme (WHATWG URL Standard).
 * @param value - The string to validate.
 * @returns `true` if the string is a valid HTTP or HTTPS URL.
 */
export declare const isUrl: (value: string) => boolean;

/**
 * Validates RFC 4122 UUID v4 format.
 * @param value - The string to validate.
 * @returns `true` if the string is a valid UUID v4.
 */
export declare const isUuid: (value: string) => boolean;

/**
 * Validates ISO 8601 date or datetime format.
 * @param value - The string to validate.
 * @returns `true` if the string is a valid ISO 8601 date or datetime.
 */
export declare const isIsoDate: (value: string) => boolean;

/**
 * Validates IPv4 or IPv6 address format.
 * @param value - The string to validate.
 * @returns `true` if the string is a valid IP address.
 */
export declare const isIpAddress: (value: string) => boolean;

/**
 * Asserts that a value is neither `null` nor `undefined`. Throws `TypeError` on failure.
 * @typeParam T - The expected non-nullish type.
 * @param value - The value to assert.
 * @param label - Human-readable label for the error message.
 * @returns The original value narrowed to exclude null and undefined.
 */
export declare const assertNonNullish: <T>(value: T | null | undefined, label: string) => T;

/**
 * Aggregated validation algorithm family.
 */
export declare const validationAlgorithms: {
  readonly isEmail: typeof isEmail;
  readonly isUrl: typeof isUrl;
  readonly isUuid: typeof isUuid;
  readonly isIsoDate: typeof isIsoDate;
  readonly isIpAddress: typeof isIpAddress;
  readonly assertNonNullish: typeof assertNonNullish;
};
