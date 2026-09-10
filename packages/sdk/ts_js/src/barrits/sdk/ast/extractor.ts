import type * as TypeScript from "typescript";
import { joinPath, normalizePath } from "../path";
import { createCachedSourceFile, loadTypeScript, requireTypeScript } from "./cache";
import type { BarritsFileExport, RuntimeFileSystemAdapter } from "../contracts";

const SOURCE_EXTENSION_PATTERN = /\.(?:[cm]?[jt]s|[jt]sx)$/i;
const TYPESCRIPT_CANDIDATES = [".ts", ".tsx", ".mts", ".cts"] as const;
const JAVASCRIPT_CANDIDATES = [".js", ".jsx", ".mjs", ".cjs"] as const;
const JAVASCRIPT_TO_TYPESCRIPT: Readonly<Record<string, string>> = {
  ".js": ".ts",
  ".jsx": ".tsx",
  ".mjs": ".mts",
  ".cjs": ".cts",
};
const JSDOC_PROBE_PATH = "<barrits-jsdoc-probe>";

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

const resolveRelativeSpecifier = (fromRelativePath: string, specifier: string): string | null => {
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
  return resolvedPath || null;
};

/**
 * Computes the canonical relative module path for a relative specifier: extension-less specifiers get `.ts`.
 * Use `resolveRelativeModuleCandidates` when the file on disk may use another extension or be a directory index.
 *
 * @param fromRelativePath - The caller module's relative location.
 * @param specifier - The import destination route explicitly passed inside the target module.
 * @returns A relative module path, or null when the specifier is not relative or resolves to nothing.
 */
export const resolveRelativeModulePath = (fromRelativePath: string, specifier: string): string | null => {
  const resolvedPath = resolveRelativeSpecifier(fromRelativePath, specifier);

  if (!resolvedPath) {
    return null;
  }

  return SOURCE_EXTENSION_PATTERN.test(resolvedPath) ? resolvedPath : `${resolvedPath}.ts`;
};

/**
 * Lists every relative path a specifier may resolve to, in resolution order: the literal path, its TypeScript
 * counterpart for `.js`/`.jsx`/`.mjs`/`.cjs` specifiers (the TypeScript ESM convention), then TypeScript and
 * JavaScript extensions and directory indexes for extension-less specifiers.
 *
 * @param fromRelativePath - The caller module's relative location.
 * @param specifier - Relative specifier found in the import/export statement.
 * @returns Candidate relative paths (empty for bare specifiers).
 */
export const resolveRelativeModuleCandidates = (fromRelativePath: string, specifier: string): string[] => {
  const resolvedPath = resolveRelativeSpecifier(fromRelativePath, specifier);

  if (!resolvedPath) {
    return [];
  }

  const extension = SOURCE_EXTENSION_PATTERN.exec(resolvedPath)?.[0].toLowerCase();

  if (extension) {
    const typescriptCounterpart = JAVASCRIPT_TO_TYPESCRIPT[extension];
    const withoutExtension = resolvedPath.slice(0, -extension.length);
    return typescriptCounterpart ? [resolvedPath, `${withoutExtension}${typescriptCounterpart}`] : [resolvedPath];
  }

  const extensions = [...TYPESCRIPT_CANDIDATES, ...JAVASCRIPT_CANDIDATES];
  return [
    ...extensions.map((candidate) => `${resolvedPath}${candidate}`),
    ...extensions.map((candidate) => `${resolvedPath}/index${candidate}`),
  ];
};

/**
 * Removes file-system extensions typical of source code files (TypeScript/JavaScript).
 *
 * @param relativePath - File path containing an extension.
 * @returns The pure, un-extensioned name sequence.
 */
export const stripSourceExtension = (relativePath: string): string => {
  return relativePath.replace(SOURCE_EXTENSION_PATTERN, "");
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

const stripJsDocDelimiters = (text: string): string => {
  return text.replace(/^\/\*\*/u, "").replace(/\*\/$/u, "");
};

/**
 * Returns the inner text of the JSDoc block attached to a statement by the TypeScript parser (the block that
 * immediately precedes the declaration), or `undefined` when the statement has no JSDoc. Because attachment is
 * decided by the parser, a plain `/* ... *\/` comment or unrelated code between a documented declaration and the
 * next one never leaks the previous block onto it.
 *
 * @param node - Statement or declaration node.
 * @param sourceFile - Source file the node belongs to.
 * @returns Inner JSDoc text (without `/**` and `*\/`), or undefined.
 */
export const getAttachedJsDoc = (node: TypeScript.Node, sourceFile: TypeScript.SourceFile): string | undefined => {
  const ts = requireTypeScript();
  const docs = ts.getJSDocCommentsAndTags(node).filter((entry): entry is TypeScript.JSDoc => ts.isJSDoc(entry));
  const attached = docs.at(-1);

  return attached ? stripJsDocDelimiters(attached.getText(sourceFile)) : undefined;
};

const findStatementAt = (sourceFile: TypeScript.SourceFile, matchIndex: number): TypeScript.Statement | undefined => {
  return sourceFile.statements.find((statement) => statement.getStart(sourceFile) === matchIndex);
};

/**
 * Extracts the JSDoc block attached to the statement that starts at `matchIndex`. The source is parsed with the
 * TypeScript compiler (cached), so attachment follows the parser's rules instead of scanning text backwards.
 * Requires the compiler API to be loaded (`await loadTypeScript()`).
 *
 * @param source - Full plain-text module source.
 * @param matchIndex - Start offset of the target statement.
 * @returns Inner JSDoc text, or undefined when no statement starts there or it carries no JSDoc.
 */
export const extractAttachedJsDoc = (source: string, matchIndex: number): string | undefined => {
  const sourceFile = createCachedSourceFile(JSDOC_PROBE_PATH, source);
  const statement = findStatementAt(sourceFile, matchIndex);

  return statement ? getAttachedJsDoc(statement, sourceFile) : undefined;
};

const parseAccessPathTag = (jsDocBlock: string | undefined): string | undefined => {
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
 * Reads the `@barrits-path` override from the JSDoc attached to the statement starting at `matchIndex`.
 *
 * @param source - Plain string module source.
 * @param matchIndex - Start offset of the target statement.
 * @returns The dotted access path override, or undefined.
 */
export const parseJsDocAccessPath = (source: string, matchIndex: number): string | undefined => {
  return parseAccessPathTag(extractAttachedJsDoc(source, matchIndex));
};

/**
 * Scans TypeScript metadata tokens querying strictly explicit public typescript export flags.
 *
 * @param node - Analyzable TypeScript AST module block root payload indexer object.
 * @returns Validates existence directly matching `ts.SyntaxKind.ExportKeyword`.
 */
export const hasExportModifier = (node: TypeScript.Node): boolean => {
  const ts = requireTypeScript();

  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  return ts.getModifiers(node)?.some((modifier: TypeScript.Modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
};

/**
 * [EN] Direct exports of a module plus the specifiers of its `export * from` statements.
 * [ES] Exports directos de un módulo más los especificadores de sus sentencias `export * from`.
 */
export type ParsedExportStatements = {
  /** [EN] Exports keyed by exported name. [ES] Exports indexados por nombre exportado. */
  readonly exportsMap: Map<string, BarritsFileExport>;
  /** [EN] Module specifiers re-exported wholesale. [ES] Especificadores de módulo reexportados íntegramente. */
  readonly exportAllSpecifiers: readonly string[];
};

type ExportPushContext = {
  readonly exportsMap: Map<string, BarritsFileExport>;
  readonly sourceFile: TypeScript.SourceFile;
  readonly relativePath: string;
  readonly visibility: "internal" | "public";
};

const pushExport = (ctx: ExportPushContext, name: string, kind: BarritsFileExport["kind"], statement: TypeScript.Statement): void => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return;
  }

  const jsDocAccessPath = parseAccessPathTag(getAttachedJsDoc(statement, ctx.sourceFile));
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

const handleVariableStatement = (ctx: ExportPushContext, statement: TypeScript.VariableStatement): void => {
  const ts = requireTypeScript();

  if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
    return;
  }

  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name)) {
      pushExport(ctx, declaration.name.text, "const", statement);
    }
  }
};

const handleExportDeclaration = (ctx: ExportPushContext, statement: TypeScript.ExportDeclaration, exportAllSpecifiers: string[]): void => {
  const ts = requireTypeScript();

  if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteralLike(statement.moduleSpecifier)) {
    exportAllSpecifiers.push(statement.moduleSpecifier.text);
    return;
  }

  if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
    return;
  }

  for (const element of statement.exportClause.elements) {
    pushExport(ctx, element.name.text, "reexport", statement);
  }
};

/**
 * [EN] Collects the direct exports of a module in one pass: `export const`, `export function`, `export class`,
 * named re-exports (`export { a, b } from`) and `export *` specifiers. Requires the TypeScript compiler API to be
 * loaded (`await loadTypeScript()`); `extractExports` does it for you.
 * [ES] Recolecta los exports directos de un módulo en una pasada: `export const`, `export function`, `export class`,
 * reexports con nombre (`export { a, b } from`) y especificadores `export *`. Requiere la API del compilador de
 * TypeScript cargada (`await loadTypeScript()`); `extractExports` lo hace por ti.
 */
export const collectDirectExports = (source: string, relativePath: string): ParsedExportStatements => {
  const ts = requireTypeScript();
  const exportsMap = new Map<string, BarritsFileExport>();
  const exportAllSpecifiers: string[] = [];
  const visibility = isInternalPath(relativePath) ? "internal" : "public";
  const sourceFile = createCachedSourceFile(relativePath, source);
  const ctx: ExportPushContext = { exportsMap, sourceFile, relativePath, visibility };

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      handleVariableStatement(ctx, statement);
      continue;
    }

    if (ts.isFunctionDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      pushExport(ctx, statement.name.text, "function", statement);
      continue;
    }

    if (ts.isClassDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      pushExport(ctx, statement.name.text, "class", statement);
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      handleExportDeclaration(ctx, statement, exportAllSpecifiers);
    }
  }

  return {
    exportsMap,
    exportAllSpecifiers,
  };
};

const readFirstExisting = async (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  candidates: readonly string[],
): Promise<{ relativePath: string; source: string } | null> => {
  for (const relativePath of candidates) {
    try {
      const source = await adapter.readTextFile(joinPath(barritsDirectory, relativePath));
      return { relativePath, source };
    } catch {
      continue;
    }
  }

  return null;
};

/**
 * Resolves the full export surface of a module by following `export * from` statements recursively. Relative
 * specifiers are resolved against the files that actually exist (`./x.js` → `x.ts`, extension-less → `.ts`,
 * `.tsx`, `.mts`, `.js`... or a directory index); re-exported entries are reported with kind `reexport`.
 *
 * @param adapter - Runtime filesystem adapter.
 * @param barritsDirectory - Root directory the relative paths are resolved against.
 * @param relativePath - Relative path of the module being inspected.
 * @param source - Source text of that module.
 * @param visited - Modules already visited (cycle protection).
 * @returns Exports sorted by name.
 */
export const extractExports = async (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  relativePath: string,
  source: string,
  visited = new Set<string>(),
): Promise<BarritsFileExport[]> => {
  await loadTypeScript();
  const { exportsMap, exportAllSpecifiers } = collectDirectExports(source, relativePath);
  visited.add(relativePath);

  for (const specifier of exportAllSpecifiers) {
    const candidates = resolveRelativeModuleCandidates(relativePath, specifier).filter((candidate) => !visited.has(candidate));

    if (candidates.length === 0) {
      continue;
    }

    const reexported = await readFirstExisting(adapter, barritsDirectory, candidates);

    if (!reexported) {
      continue;
    }

    const reexportedExports = await extractExports(adapter, barritsDirectory, reexported.relativePath, reexported.source, visited);

    for (const reexportedEntry of reexportedExports) {
      exportsMap.set(reexportedEntry.name, {
        ...reexportedEntry,
        kind: "reexport",
      });
    }
  }

  return Array.from(exportsMap.values()).sort((left, right) => left.name.localeCompare(right.name));
};
