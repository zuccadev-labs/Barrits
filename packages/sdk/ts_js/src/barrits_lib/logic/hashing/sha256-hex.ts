/**
 * Computes the SHA-256 hash of a UTF-8 string and returns it as a lowercase
 * hexadecimal digest.
 *
 * This function uses the Web Crypto API (`crypto.subtle.digest`), which is
 * available in all modern runtimes including Deno, Node.js 18+, Bun, and
 * browsers. No external dependencies are required.
 *
 * SHA-256 is the industry standard for content-addressable integrity
 * verification. It is used by Barrits to seal build manifests, ensuring
 * that automation artifacts have not been modified after generation.
 *
 * @param input - The UTF-8 string to hash.
 * @returns A promise resolving to a 64-character lowercase hexadecimal string.
 *
 * @example
 * ```ts
 * import { sha256Hex } from "@aspect/barrits";
 *
 * const manifest = JSON.stringify({ version: "0.1.4", domains: ["auth", "billing"] });
 * const checksum = await sha256Hex(manifest);
 * // checksum: "a3f2...d8e1" (64 hex chars)
 * ```
 */
export const sha256Hex = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  return Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
