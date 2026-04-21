/**
 * @module
 * Validation and assertion utilities for runtime data integrity.
 *
 * This module provides RFC-compliant format validators and typed assertion
 * guards. These functions are designed for use at service boundaries
 * (API handlers, message processors, configuration loaders) where
 * untrusted input must be validated before further processing.
 *
 * - `isEmail` — RFC 5322 simplified email format.
 * - `isUrl` — WHATWG URL Standard with HTTP/HTTPS scheme restriction.
 * - `isUuid` — RFC 4122 UUID v4 format.
 * - `isIsoDate` — ISO 8601 date and datetime format.
 * - `isIpAddress` — IPv4 and IPv6 address format.
 * - `assertNonNullish` — Typed non-null assertion with traceable error messages.
 */

export { isEmail, isUrl, isUuid, isIsoDate, isIpAddress, assertNonNullish } from "./validators.ts";

import { isEmail, isUrl, isUuid, isIsoDate, isIpAddress, assertNonNullish } from "./validators.ts";

/**
 * Aggregated validation algorithm family.
 *
 * Provides a unified namespace for all format validators and assertion
 * guards used in service-boundary input processing.
 */
export const validationAlgorithms = {
  /** Validates RFC 5322 email format. */
  isEmail,
  /** Validates WHATWG URL with HTTP/HTTPS scheme. */
  isUrl,
  /** Validates RFC 4122 UUID v4 format. */
  isUuid,
  /** Validates ISO 8601 date/datetime format. */
  isIsoDate,
  /** Validates IPv4 or IPv6 address format. */
  isIpAddress,
  /** Asserts a value is neither null nor undefined. */
  assertNonNullish,
} as const;
