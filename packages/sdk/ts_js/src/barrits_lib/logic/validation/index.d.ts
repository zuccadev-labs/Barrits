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
export { isEmail, isUrl, isUuid, isIsoDate, isIpAddress, assertNonNullish } from "./validators";
/**
 * Aggregated validation algorithm family.
 *
 * Provides a unified namespace for all format validators and assertion
 * guards used in service-boundary input processing.
 */
export declare const validationAlgorithms: {
    /** Validates RFC 5322 email format. */
    readonly isEmail: (value: string) => boolean;
    /** Validates WHATWG URL with HTTP/HTTPS scheme. */
    readonly isUrl: (value: string) => boolean;
    /** Validates RFC 4122 UUID v4 format. */
    readonly isUuid: (value: string) => boolean;
    /** Validates ISO 8601 date/datetime format. */
    readonly isIsoDate: (value: string) => boolean;
    /** Validates IPv4 or IPv6 address format. */
    readonly isIpAddress: (value: string) => boolean;
    /** Asserts a value is neither null nor undefined. */
    readonly assertNonNullish: <T>(value: T | null | undefined, label: string) => T;
};
