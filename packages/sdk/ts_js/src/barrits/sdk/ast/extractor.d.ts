import ts from "typescript";
import type { BarritsFileExport, RuntimeFileSystemAdapter } from "../contracts";
/**
 * Normalizes a path string against a designated base path by isolating the relative sub-route.
 *
 * @param basePath - The origin directory namespace.
 * @param targetPath - The absolute or unnormalized target path.
 * @returns A computed relative path respecting POSIX standards.
 */
export declare const relativeFromBase: (basePath: string, targetPath: string) => string;
/**
 * Assesses whether a relative route references internal tooling scopes that restrict public API exporting.
 *
 * @param relativePath - The portable module target route.
 * @returns True if the file targets internal domain architecture.
 */
export declare const isInternalPath: (relativePath: string) => boolean;
/**
 * Splits a file path into its internal POSIX segment components.
 *
 * @param path - The string path representation.
 * @returns A filtered array containing discrete path segments.
 */
export declare const splitPathSegments: (path: string) => string[];
/**
 * Computes a relative module specifier targeting against an origin component's file path.
 *
 * @param fromRelativePath - The caller module's relative location.
 * @param specifier - The import destination route explicitly passed inside the target module.
 * @returns A fully verified relative typescript module path, or null if unresolvable.
 */
export declare const resolveRelativeModulePath: (fromRelativePath: string, specifier: string) => string | null;
/**
 * Removes file-system extensions typical of source code files (TypeScript/JavaScript).
 *
 * @param relativePath - File path containing an extension.
 * @returns The pure, un-extensioned name sequence.
 */
export declare const stripSourceExtension: (relativePath: string) => string;
/**
 * Interprets a filesystem relative source path transforming it into structural namespace boundaries.
 *
 * @param relativePath - Contextual relative path descriptor.
 * @returns Array representing abstract syntax access spaces.
 */
export declare const toAccessSegments: (relativePath: string) => string[];
/**
 * Computes the unified domain-specific access object representation of a module export constraint.
 *
 * @param relativePath - Component's source location path.
 * @param exportName - Real programmatic exported symbol signature.
 * @returns The absolute accessor namespace mapping expected internally by platforms.
 */
export declare const deriveExportAccessPath: (relativePath: string, exportName: string) => string;
/**
 * Extracts a JSDoc block cleanly detached from overhead node definitions by iterating directly over Source File index blocks.
 *
 * @param source - Full plain-text typescript module file raw buffer.
 * @param matchIndex - Locational pinpoint bounding index over the abstract target property node.
 * @returns A structurally clean and unparsed interior documentation payload without trailing syntax wrapper bytes.
 */
export declare const extractAttachedJsDoc: (source: string, matchIndex: number) => string | undefined;
/**
 * Filters normalized JSDoc inputs evaluating path structure and filtering implicit structural data components.
 *
 * @param source - Plain string module buffer payload.
 * @param matchIndex - Pointer memory locational byte index targeting a declaration node.
 * @returns The resolved `@barrits-path` structural route override strings, or undefined natively.
 */
export declare const parseJsDocAccessPath: (source: string, matchIndex: number) => string | undefined;
/**
 * Scans TypeScript metadata tokens querying strictly explicit public typescript export flags.
 *
 * @param node - Analyzable TypeScript AST module block root payload indexer object.
 * @returns Validates existence directly matching `ts.SyntaxKind.ExportKeyword`.
 */
export declare const hasExportModifier: (node: ts.Node) => boolean;
export type ParsedExportStatements = {
    readonly exportsMap: Map<string, BarritsFileExport>;
    readonly exportAllSpecifiers: readonly string[];
};
/**
 * Queries abstract module components identifying named and default explicit programmatic payload exports globally mapping access keys.
 *
 * @param source - Immutable parsed plain text input.
 * @param relativePath - Unmutated contextual system identifier relative file path mapping string locator strings identifier maps.
 * @returns An extracted ParsedExportStatements object mapping standard definitions and aggregating broad system namespace overrides logic dependencies map.
 */
export declare const collectDirectExports: (source: string, relativePath: string) => ParsedExportStatements;
/**
 * Discovers deeply nested cross-file re-export mechanisms tracing import blocks recursively.
 * Builds an exhaustive export manifest targeting namespace paths globally natively resolving internal scopes mappings.
 *
 * @param adapter - Readonly abstract adapter targeting execution runtime payloads.
 * @param barritsDirectory - Original abstract context namespace target logics.
 * @param relativePath - Internal targeting mapping dependency nested payload pointer location root abstraction.
 * @param source - Plaintext dependency target dependency bindings native pointer bindings.
 * @param visited - Shared deduplicating context recursive caching logic.
 * @returns Explicit explicit exported manifest module configurations natively mapped to export file components object payload.
 */
export declare const extractExports: (adapter: RuntimeFileSystemAdapter, barritsDirectory: string, relativePath: string, source: string, visited?: Set<string>) => Promise<BarritsFileExport[]>;
