import ts from "typescript";
import { joinPath, normalizePath } from "../path";
import { createCachedSourceFile } from "./cache";
import type { BarritsFileExport, RuntimeFileSystemAdapter } from "../contracts";

const SUPPORTED_SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/i;

/**
 * Normalizes a path string against a designated base path by isolating the relative sub-route.
 *
 * @param basePath - The origin directory namespace.
 * @param targetPath - The absolute or unnormalized target path.
 * @returns A computed relative path respecting POSIX standards.
 */
export const relativeFromBase = (basePath: string, targetPath: string): string => {
  const normalizedBase = normalizePath(basePath);
  const normalizedTarget = normalizePath(targetPath);
  const prefix = `${normalizedBase}/`;

  if (normalizedTarget === normalizedBase) {
    return "";
  }

  return normalizedTarget.startsWith(prefix) ? normalizedTarget.slice(prefix.length) : normalizedTarget;
};

/**
 * Assesses whether a relative route references internal tooling scopes that restrict public API exporting.
 *
 * @param relativePath - The portable module target route.
 * @returns True if the file targets internal domain architecture.
 */
export const isInternalPath = (relativePath: string): boolean => {
  return (
    relativePath === "internal.ts" ||
    relativePath.includes("/internal/") ||
    relativePath.endsWith("/internal.ts") ||
    relativePath.startsWith("internal/")
  );
};

/**
 * Splits a file path into its internal POSIX segment components.
 *
 * @param path - The string path representation.
 * @returns A filtered array containing discrete path segments.
 */
export const splitPathSegments = (path: string): string[] => {
  return normalizePath(path)
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
};

/**
 * Computes a relative module specifier targeting against an origin component's file path.
 *
 * @param fromRelativePath - The caller module's relative location.
 * @param specifier - The import destination route explicitly passed inside the target module.
 * @returns A fully verified relative typescript module path, or null if unresolvable.
 */
export const resolveRelativeModulePath = (fromRelativePath: string, specifier: string): string | null => {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const sourceSegments = splitPathSegments(fromRelativePath);
  sourceSegments.pop();

  for (const segment of splitPathSegments(specifier)) {
    if (segment === ".") {
      continue;
    }

    if (segment === "..") {
      sourceSegments.pop();
      continue;
    }

    sourceSegments.push(segment);
  }

  const resolvedPath = sourceSegments.join("/");

  if (!resolvedPath) {
    return null;
  }

  if (SUPPORTED_SOURCE_FILE.test(resolvedPath)) {
    return resolvedPath;
  }

  return `${resolvedPath}.ts`;
};

/**
 * Removes file-system extensions typical of source code files (TypeScript/JavaScript).
 *
 * @param relativePath - File path containing an extension.
 * @returns The pure, un-extensioned name sequence.
 */
export const stripSourceExtension = (relativePath: string): string => {
  return relativePath.replace(/\.(?:[cm]?[jt]s|[jt]sx)$/i, "");
};

/**
 * Interprets a filesystem relative source path transforming it into structural namespace boundaries.
 *
 * @param relativePath - Contextual relative path descriptor.
 * @returns Array representing abstract syntax access spaces.
 */
export const toAccessSegments = (relativePath: string): string[] => {
  const segments = splitPathSegments(stripSourceExtension(relativePath));

  if (segments.at(-1) === "index") {
    segments.pop();
  }

  return segments;
};

/**
 * Computes the unified domain-specific access object representation of a module export constraint.
 *
 * @param relativePath - Component's source location path.
 * @param exportName - Real programmatic exported symbol signature.
 * @returns The absolute accessor namespace mapping expected internally by platforms.
 */
export const deriveExportAccessPath = (relativePath: string, exportName: string): string => {
  const segments = toAccessSegments(relativePath);

  if (segments.length <= 1) {
    return exportName;
  }

  const domainSegments = segments.slice(1);

  if (domainSegments.at(-1) === exportName) {
    return domainSegments.join(".");
  }

  return [...domainSegments, exportName].join(".");
};

/**
 * Extracts a JSDoc block cleanly detached from overhead node definitions by iterating directly over Source File index blocks.
 *
 * @param source - Full plain-text typescript module file raw buffer.
 * @param matchIndex - Locational pinpoint bounding index over the abstract target property node.
 * @returns A structurally clean and unparsed interior documentation payload without trailing syntax wrapper bytes.
 */
export const extractAttachedJsDoc = (source: string, matchIndex: number): string | undefined => {
  const beforeMatch = source.slice(0, matchIndex).replace(/\s+$/u, "");

  if (!beforeMatch.endsWith("*/")) {
    return undefined;
  }

  const openIndex = beforeMatch.lastIndexOf("/**");

  if (openIndex === -1) {
    return undefined;
  }

  return beforeMatch.slice(openIndex + 3, beforeMatch.length - 2);
};

/**
 * Filters normalized JSDoc inputs evaluating path structure and filtering implicit structural data components.
 *
 * @param source - Plain string module buffer payload.
 * @param matchIndex - Pointer memory locational byte index targeting a declaration node.
 * @returns The resolved `@barrits-path` structural route override strings, or undefined natively.
 */
export const parseJsDocAccessPath = (source: string, matchIndex: number): string | undefined => {
  const jsDocBlock = extractAttachedJsDoc(source, matchIndex);

  if (!jsDocBlock) {
    return undefined;
  }

  const tagMatch = /@barrits-path\s+([^\n\r*]+)/.exec(jsDocBlock);

  if (!tagMatch) {
    return undefined;
  }

  return (
    tagMatch[1]
      .split(".")
      .map((segment: string) => segment.trim())
      .filter(Boolean)
      .join(".") || undefined
  );
};

/**
 * Scans TypeScript metadata tokens querying strictly explicit public typescript export flags.
 *
 * @param node - Analyzable TypeScript AST module block root payload indexer object.
 * @returns Validates existence directly matching `ts.SyntaxKind.ExportKeyword`.
 */
export const hasExportModifier = (node: ts.Node): boolean => {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  return ts.getModifiers(node)?.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
};

/**
 * [EN] Type definition for ParsedExportStatements.
 * [ES] Definición de tipo para ParsedExportStatements.
 */
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
type ExportPushContext = {
  readonly exportsMap: Map<string, BarritsFileExport>;
  readonly source: string;
  readonly relativePath: string;
  readonly visibility: "internal" | "public";
};

const pushExport = (ctx: ExportPushContext, name: string, kind: BarritsFileExport["kind"], matchIndex: number): void => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return;
  }

  const jsDocAccessPath = parseJsDocAccessPath(ctx.source, matchIndex);
  const derivedAccessPath = deriveExportAccessPath(ctx.relativePath, normalizedName);
  const accessPath = jsDocAccessPath ?? derivedAccessPath;
  const accessStrategy = jsDocAccessPath ? "jsdoc" : accessPath === normalizedName ? "export-name" : "file-system";

  ctx.exportsMap.set(normalizedName, {
    name: normalizedName,
    accessPath,
    accessStrategy,
    kind,
    visibility: ctx.visibility,
  });
};

const handleVariableStatement = (ctx: ExportPushContext, statement: ts.VariableStatement, matchIndex: number): void => {
  if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
    return;
  }

  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name)) {
      pushExport(ctx, declaration.name.text, "const", matchIndex);
    }
  }
};

const handleFunctionDeclaration = (ctx: ExportPushContext, statement: ts.FunctionDeclaration, matchIndex: number): void => {
  if (statement.name) {
    pushExport(ctx, statement.name.text, "function", matchIndex);
  }
};

const handleExportDeclaration = (
  ctx: ExportPushContext,
  statement: ts.ExportDeclaration,
  exportAllSpecifiers: string[],
  matchIndex: number,
): void => {
  if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteralLike(statement.moduleSpecifier)) {
    exportAllSpecifiers.push(statement.moduleSpecifier.text);
    return;
  }

  if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
    return;
  }

  for (const element of statement.exportClause.elements) {
    pushExport(ctx, element.name.text, "reexport", matchIndex);
  }
};

/**
 * [EN] Collects all direct exports (named, default, re-exports) from a source file's AST in one pass.
 * [ES] Recolecta todas las exportaciones directas (nombradas, por defecto, re-exportaciones) desde el AST de un archivo fuente en una pasada.
 */
export const collectDirectExports = (source: string, relativePath: string): ParsedExportStatements => {
  const exportsMap = new Map<string, BarritsFileExport>();
  const exportAllSpecifiers: string[] = [];
  const visibility = isInternalPath(relativePath) ? "internal" : "public";
  const sourceFile = createCachedSourceFile(relativePath, source);
  const ctx: ExportPushContext = { exportsMap, source, relativePath, visibility };

  for (const statement of sourceFile.statements) {
    const matchIndex = statement.getStart(sourceFile);

    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      handleVariableStatement(ctx, statement, matchIndex);
      continue;
    }

    if (ts.isFunctionDeclaration(statement) && hasExportModifier(statement)) {
      handleFunctionDeclaration(ctx, statement, matchIndex);
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      handleExportDeclaration(ctx, statement, exportAllSpecifiers, matchIndex);
    }
  }

  return {
    exportsMap,
    exportAllSpecifiers,
  };
};

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
export const extractExports = async (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  relativePath: string,
  source: string,
  visited = new Set<string>(),
): Promise<BarritsFileExport[]> => {
  const { exportsMap, exportAllSpecifiers } = collectDirectExports(source, relativePath);
  visited.add(relativePath);

  for (const specifier of exportAllSpecifiers) {
    const resolvedRelativePath = resolveRelativeModulePath(relativePath, specifier);

    if (!resolvedRelativePath || visited.has(resolvedRelativePath)) {
      continue;
    }

    const absoluteFilePath = joinPath(barritsDirectory, resolvedRelativePath);

    try {
      const reexportedSource = await adapter.readTextFile(absoluteFilePath);
      const reexportedExports = await extractExports(adapter, barritsDirectory, resolvedRelativePath, reexportedSource, visited);

      for (const reexportedEntry of reexportedExports) {
        exportsMap.set(reexportedEntry.name, {
          ...reexportedEntry,
          kind: "reexport",
        });
      }
    } catch {
      continue;
    }
  }

  return Array.from(exportsMap.values()).sort((left, right) => left.name.localeCompare(right.name));
};
