import type {
  BarritsDiscovery,
  BarritsDomainIntegration,
  BarritsExportCollision,
  BarritsExportAccessStrategy,
  BarritsFileExport,
  BarritsFileIntegration,
  BarritsFileKind,
  BarritsImportAction,
  BarritsIntegrationGraph,
  BarritsSourceLayer,
  BarritsTraitDiagnostic,
  BarritsTraitDescriptorInspection,
  RuntimeFileSystemAdapter,
} from "./contracts";
import ts from "typescript";
import { joinPath, normalizePath } from "./path";
import { parseTraitDescriptorJsDoc } from "../traits/descriptor";

const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", ".next", ".turbo"]);
const SUPPORTED_SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/i;

type InspectedLayer = {
  readonly rootFiles: readonly BarritsFileIntegration[];
  readonly domains: readonly BarritsDomainIntegration[];
  readonly files: readonly BarritsFileIntegration[];
};

const relativeFromBase = (basePath: string, targetPath: string): string => {
  const normalizedBase = normalizePath(basePath);
  const normalizedTarget = normalizePath(targetPath);
  const prefix = `${normalizedBase}/`;

  if (normalizedTarget === normalizedBase) {
    return "";
  }

  return normalizedTarget.startsWith(prefix) ? normalizedTarget.slice(prefix.length) : normalizedTarget;
};

const toRelativeFilePath = (barritsDirectory: string, filePath: string): string => {
  return relativeFromBase(barritsDirectory, filePath);
};

const isInternalPath = (relativePath: string): boolean => {
  return relativePath === "internal.ts" || relativePath.includes("/internal/") || relativePath.endsWith("/internal.ts") || relativePath.startsWith("internal/");
};

const classifyFileKind = (relativePath: string): BarritsFileKind => {
  if (relativePath === "index.ts") {
    return "root";
  }

  if (relativePath.endsWith("/index.ts")) {
    return "barrel";
  }

  if (isInternalPath(relativePath)) {
    return "internal";
  }

  if (relativePath.startsWith("traits/")) {
    return "trait";
  }

  if (relativePath.startsWith("shared/")) {
    return "shared";
  }

  if (relativePath.startsWith("sdk/")) {
    return "sdk";
  }

  return "domain";
};

const splitPathSegments = (path: string): string[] => {
  return normalizePath(path)
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const resolveRelativeModulePath = (fromRelativePath: string, specifier: string): string | null => {
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

const stripSourceExtension = (relativePath: string): string => {
  return relativePath.replace(/\.(?:[cm]?[jt]s|[jt]sx)$/i, "");
};

const toAccessSegments = (relativePath: string): string[] => {
  const segments = splitPathSegments(stripSourceExtension(relativePath));

  if (segments.at(-1) === "index") {
    segments.pop();
  }

  return segments;
};

const normalizeAccessPath = (value: string): string => {
  return value
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join(".");
};

const deriveExportAccessPath = (relativePath: string, exportName: string): string => {
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

const extractAttachedJsDoc = (source: string, matchIndex: number): string | undefined => {
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

const parseJsDocAccessPath = (source: string, matchIndex: number): string | undefined => {
  const jsDocBlock = extractAttachedJsDoc(source, matchIndex);

  if (!jsDocBlock) {
    return undefined;
  }

  const tagMatch = /@barrits-path\s+([^\n\r*]+)/.exec(jsDocBlock);

  if (!tagMatch) {
    return undefined;
  }

  const normalizedPath = normalizeAccessPath(tagMatch[1]);
  return normalizedPath || undefined;
};

type ExportedTraitBinding = {
  readonly bindingKind: "const" | "function" | "class";
  readonly bindingName: string;
  readonly matchIndex: number;
  readonly runtimeConflicts?: readonly string[];
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  readonly runtimeConsumes?: readonly string[];
  readonly runtimeName?: string;
  readonly runtimeRequires?: readonly string[];
  readonly runtimeProvides?: readonly string[];
  readonly runtimeState?: readonly string[];
};

type TraitRuntimeMetadata = {
  readonly conflicts?: readonly string[];
  readonly consumes?: readonly string[];
  readonly name?: string;
  readonly requires?: readonly string[];
  readonly provides?: readonly string[];
  readonly state?: readonly string[];
};

const hasExportModifier = (node: ts.Node): boolean => {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  return ts.getModifiers(node)?.some((modifier: ts.Modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
};

const resolveTraitDescriptorFactoryFromExpression = (
  expression: ts.Expression | undefined,
): "createTraitDescriptor" | "createTraitDescriptorFromJsDoc" | undefined => {
  if (!expression) {
    return undefined;
  }

  if (ts.isCallExpression(expression)) {
    if (ts.isIdentifier(expression.expression)) {
      if (expression.expression.text === "createTraitDescriptorFromJsDoc") {
        return "createTraitDescriptorFromJsDoc";
      }

      if (expression.expression.text === "createTraitDescriptor") {
        return "createTraitDescriptor";
      }
    }

    return resolveTraitDescriptorFactoryFromExpression(expression.expression)
      ?? expression.arguments
        .map((argument) => resolveTraitDescriptorFactoryFromExpression(argument))
        .find(Boolean);
  }

  if (
    ts.isParenthesizedExpression(expression)
    || ts.isAsExpression(expression)
    || ts.isSatisfiesExpression(expression)
    || ts.isNonNullExpression(expression)
  ) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  if (ts.isConditionalExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.whenTrue)
      ?? resolveTraitDescriptorFactoryFromExpression(expression.whenFalse);
  }

  if (ts.isBinaryExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.left)
      ?? resolveTraitDescriptorFactoryFromExpression(expression.right);
  }

  if (ts.isAwaitExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  return undefined;
};

const readStringArrayLiteral = (expression: ts.Expression | undefined): string[] | undefined => {
  if (!expression || !ts.isArrayLiteralExpression(expression)) {
    return undefined;
  }

  const values = expression.elements
    .filter((element): element is ts.StringLiteralLike => ts.isStringLiteralLike(element))
    .map((element) => element.text.trim())
    .filter(Boolean);

  return values.length > 0 ? Array.from(new Set(values)).sort((left, right) => left.localeCompare(right)) : [];
};

const readTraitRuntimeMetadataFromCall = (expression: ts.Expression | undefined): TraitRuntimeMetadata | undefined => {
  if (!expression || !ts.isCallExpression(expression) || !ts.isIdentifier(expression.expression)) {
    return undefined;
  }

  if (expression.expression.text !== "createTraitDescriptor") {
    return undefined;
  }

  const descriptorArgument = expression.arguments[0];

  if (!descriptorArgument || !ts.isObjectLiteralExpression(descriptorArgument)) {
    return undefined;
  }

  let runtimeName: string | undefined;
  let runtimeConflicts: readonly string[] = [];
  let runtimeRequires: readonly string[] = [];
  let runtimeConsumes: readonly string[] = [];
  let runtimeProvides: readonly string[] | undefined;
  let runtimeState: readonly string[] = [];
  let hasDynamicConflicts = false;
  let hasDynamicRequires = false;
  let hasDynamicConsumes = false;
  let hasDynamicProvides = false;
  let hasDynamicState = false;

  for (const property of descriptorArgument.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
      continue;
    }

    if (property.name.text === "name" && ts.isStringLiteralLike(property.initializer)) {
      runtimeName = property.initializer.text.trim() || undefined;
      continue;
    }

    if (property.name.text === "provides") {
      runtimeProvides = readStringArrayLiteral(property.initializer);
      hasDynamicProvides = runtimeProvides === undefined;
      continue;
    }

    if (property.name.text === "conflicts") {
      runtimeConflicts = readStringArrayLiteral(property.initializer) ?? [];
      hasDynamicConflicts = readStringArrayLiteral(property.initializer) === undefined;
      continue;
    }

    if (property.name.text === "requires") {
      runtimeRequires = readStringArrayLiteral(property.initializer) ?? [];
      hasDynamicRequires = readStringArrayLiteral(property.initializer) === undefined;
      continue;
    }

    if (property.name.text === "consumes") {
      runtimeConsumes = readStringArrayLiteral(property.initializer) ?? [];
      hasDynamicConsumes = readStringArrayLiteral(property.initializer) === undefined;
      continue;
    }

    if (property.name.text === "state") {
      runtimeState = readStringArrayLiteral(property.initializer) ?? [];
      hasDynamicState = readStringArrayLiteral(property.initializer) === undefined;
    }
  }

  return {
    conflicts: hasDynamicConflicts ? undefined : runtimeConflicts,
    consumes: hasDynamicConsumes ? undefined : runtimeConsumes,
    name: runtimeName,
    requires: hasDynamicRequires ? undefined : runtimeRequires,
    provides: hasDynamicProvides ? undefined : runtimeProvides,
    state: hasDynamicState ? undefined : runtimeState,
  };
};

const collectExportedTraitBindings = (source: string, relativePath: string): ExportedTraitBinding[] => {
  const sourceFile = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);
  const bindings: ExportedTraitBinding[] = [];

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
        continue;
      }

      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          continue;
        }

        const runtimeMetadata = readTraitRuntimeMetadataFromCall(declaration.initializer);

        bindings.push({
          bindingKind: "const",
          bindingName: declaration.name.text,
          matchIndex: statement.getStart(sourceFile),
          runtimeConflicts: runtimeMetadata?.conflicts,
          runtimeConsumes: runtimeMetadata?.consumes,
          factory: resolveTraitDescriptorFactoryFromExpression(declaration.initializer),
          runtimeName: runtimeMetadata?.name,
          runtimeRequires: runtimeMetadata?.requires,
          runtimeProvides: runtimeMetadata?.provides,
          runtimeState: runtimeMetadata?.state,
        });
      }

      continue;
    }

    if (ts.isFunctionDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      bindings.push({
        bindingKind: "function",
        bindingName: statement.name.text,
        matchIndex: statement.getStart(sourceFile),
      });
      continue;
    }

    if (ts.isClassDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      bindings.push({
        bindingKind: "class",
        bindingName: statement.name.text,
        matchIndex: statement.getStart(sourceFile),
      });
    }
  }

  return bindings;
};

const collectTraitDescriptorMetadata = (source: string, relativePath: string): BarritsTraitDescriptorInspection[] => {
  const descriptors: BarritsTraitDescriptorInspection[] = [];

  for (const binding of collectExportedTraitBindings(source, relativePath)) {
    const jsDocBlock = extractAttachedJsDoc(source, binding.matchIndex);

    if (!jsDocBlock || !jsDocBlock.includes("@barrits-trait")) {
      continue;
    }

    const metadata = parseTraitDescriptorJsDoc(`/**${jsDocBlock}*/`);

    if (!metadata.name) {
      continue;
    }

    descriptors.push({
      name: metadata.name,
      sourceFile: relativePath,
      bindingName: binding.bindingName,
      bindingKind: binding.bindingKind,
      factory: binding.factory,
      summary: metadata.summary,
      requires: metadata.requires,
      conflicts: metadata.conflicts,
      state: metadata.state,
      consumes: metadata.consumes,
      provides: metadata.provides,
      tags: metadata.tags,
      runtimes: metadata.runtimes,
    });
  }

  return descriptors.sort((left, right) => left.name.localeCompare(right.name));
};

type ParsedExportStatements = {
  readonly exportsMap: Map<string, BarritsFileExport>;
  readonly exportAllSpecifiers: readonly string[];
};

const collectDirectExports = (source: string, relativePath: string): ParsedExportStatements => {
  const exportsMap = new Map<string, BarritsFileExport>();
  const exportAllSpecifiers: string[] = [];
  const visibility = isInternalPath(relativePath) ? "internal" : "public";
  const sourceFile = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);

  const pushExport = (name: string, kind: BarritsFileExport["kind"], matchIndex: number): void => {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    const jsDocAccessPath = parseJsDocAccessPath(source, matchIndex);
    const derivedAccessPath = deriveExportAccessPath(relativePath, normalizedName);
    const accessPath = jsDocAccessPath ?? derivedAccessPath;
    const accessStrategy: BarritsExportAccessStrategy = jsDocAccessPath
      ? "jsdoc"
      : accessPath === normalizedName
        ? "export-name"
        : "file-system";

    exportsMap.set(normalizedName, {
      name: normalizedName,
      accessPath,
      accessStrategy,
      kind,
      visibility,
    });
  };

  for (const statement of sourceFile.statements) {
    const matchIndex = statement.getStart(sourceFile);

    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
        continue;
      }

      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          pushExport(declaration.name.text, "const", matchIndex);
        }
      }

      continue;
    }

    if (ts.isFunctionDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      pushExport(statement.name.text, "function", matchIndex);
      continue;
    }

    if (!ts.isExportDeclaration(statement)) {
      continue;
    }

    if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteralLike(statement.moduleSpecifier)) {
      exportAllSpecifiers.push(statement.moduleSpecifier.text);
      continue;
    }

    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
      continue;
    }

    for (const element of statement.exportClause.elements) {
      pushExport(element.name.text, "reexport", matchIndex);
    }
  }

  return {
    exportsMap,
    exportAllSpecifiers,
  };
};

const extractExports = async (
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
      const reexportedExports = await extractExports(
        adapter,
        barritsDirectory,
        resolvedRelativePath,
        reexportedSource,
        visited,
      );

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

const inspectFile = async (
  adapter: RuntimeFileSystemAdapter,
  barritsDirectory: string,
  filePath: string,
  sourceLayer: BarritsSourceLayer,
): Promise<BarritsFileIntegration> => {
  const source = await adapter.readTextFile(filePath);
  const relativePath = toRelativeFilePath(barritsDirectory, filePath);

  return {
    path: relativePath,
    isIndex: relativePath.endsWith("/index.ts") || relativePath === "index.ts",
    kind: classifyFileKind(relativePath),
    sourceLayer,
    exports: await extractExports(adapter, barritsDirectory, relativePath, source),
    traitDescriptors: classifyFileKind(relativePath) === "trait"
      ? collectTraitDescriptorMetadata(source, relativePath)
      : [],
  };
};

const collectFiles = async (
  adapter: RuntimeFileSystemAdapter,
  rootDirectory: string,
): Promise<string[]> => {
  const files: string[] = [];
  const queue: string[] = [rootDirectory];

  while (queue.length > 0) {
    const currentDirectory = queue.shift();

    if (!currentDirectory) {
      continue;
    }

    const entries = await adapter.listEntries(currentDirectory);

    for (const entry of entries) {
      if (entry.type === "directory") {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          queue.push(joinPath(currentDirectory, entry.name));
        }

        continue;
      }

      if (SUPPORTED_SOURCE_FILE.test(entry.name)) {
        files.push(joinPath(currentDirectory, entry.name));
      }
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
};

const buildLayer = (directory: string, files: readonly BarritsFileIntegration[]): InspectedLayer => {
  const domainsMap = new Map<string, { path: string; files: BarritsFileIntegration[] }>();
  const rootFiles: BarritsFileIntegration[] = [];

  for (const file of files) {
    const [domainName] = file.path.split("/");

    if (!file.path.includes("/")) {
      rootFiles.push(file);
      continue;
    }

    const existingDomain = domainsMap.get(domainName);

    if (existingDomain) {
      existingDomain.files.push(file);
      continue;
    }

    domainsMap.set(domainName, {
      path: joinPath(directory, domainName),
      files: [file],
    });
  }

  return {
    rootFiles: rootFiles.sort((left, right) => {
      if (left.path === right.path) {
        return left.sourceLayer.localeCompare(right.sourceLayer);
      }

      return left.path.localeCompare(right.path);
    }),
    domains: Array.from(domainsMap.entries())
      .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
      .map(([name, value]) => ({
        name,
        path: value.path,
        files: value.files.sort((left, right) => {
          if (left.path === right.path) {
            return left.sourceLayer.localeCompare(right.sourceLayer);
          }

          return left.path.localeCompare(right.path);
        }),
      })),
    files,
  };
};

const inspectLayer = async (
  adapter: RuntimeFileSystemAdapter,
  directory: string | undefined,
  sourceLayer: BarritsSourceLayer,
): Promise<InspectedLayer> => {
  if (!directory) {
    return {
      rootFiles: [],
      domains: [],
      files: [],
    };
  }

  const files = await collectFiles(adapter, directory);
  const inspectedFiles = await Promise.all(
    files.map((filePath) => inspectFile(adapter, directory, filePath, sourceLayer)),
  );

  return buildLayer(directory, inspectedFiles);
};

const mergeRootFiles = (
  projectRootFiles: readonly BarritsFileIntegration[],
  libraryRootFiles: readonly BarritsFileIntegration[],
): BarritsFileIntegration[] => {
  return [...projectRootFiles, ...libraryRootFiles].sort((left, right) => {
    if (left.path === right.path) {
      return left.sourceLayer.localeCompare(right.sourceLayer);
    }

    return left.path.localeCompare(right.path);
  });
};

const mergeDomains = (
  projectDomains: readonly BarritsDomainIntegration[],
  libraryDomains: readonly BarritsDomainIntegration[],
): BarritsDomainIntegration[] => {
  const mergedDomains = new Map<string, BarritsDomainIntegration>();

  for (const domain of [...projectDomains, ...libraryDomains]) {
    const existingDomain = mergedDomains.get(domain.name);

    if (!existingDomain) {
      mergedDomains.set(domain.name, {
        ...domain,
        files: [...domain.files],
      });
      continue;
    }

    mergedDomains.set(domain.name, {
      ...existingDomain,
      files: [...existingDomain.files, ...domain.files].sort((left, right) => {
        if (left.path === right.path) {
          return left.sourceLayer.localeCompare(right.sourceLayer);
        }

        return left.path.localeCompare(right.path);
      }),
    });
  }

  return Array.from(mergedDomains.values()).sort((left, right) => left.name.localeCompare(right.name));
};

type PublicNamespaceEntry = {
  namespace: string;
  exportName: string;
  sourceFile: string;
};

const isAggregatorFile = (path: string): boolean => {
  return path === "index.ts" || path.endsWith("/index.ts") || path === "api/flat.ts";
};

const collectPublicNamespaceEntries = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
): PublicNamespaceEntry[] => {
  const entries: PublicNamespaceEntry[] = [];

  for (const file of rootFiles.filter((rootFile) => rootFile.path === "index.ts")) {
    for (const exportedMember of file.exports) {
      if (exportedMember.visibility === "public") {
        entries.push({
          namespace: "root",
          exportName: exportedMember.accessPath,
          sourceFile: file.path,
        });
      }
    }
  }

  for (const domain of domains) {
    const isApiDomain = domain.name === "api";

    for (const file of domain.files) {
      if (isApiDomain && file.path !== "api/flat.ts") {
        continue;
      }

      for (const exportedMember of file.exports) {
        if (exportedMember.visibility === "public") {
          entries.push({
            namespace: domain.name,
            exportName: isApiDomain ? exportedMember.name : exportedMember.accessPath,
            sourceFile: file.path,
          });
        }
      }
    }
  }

  return entries.sort((left, right) => {
    if (left.namespace === right.namespace) {
      if (left.exportName === right.exportName) {
        return left.sourceFile.localeCompare(right.sourceFile);
      }

      return left.exportName.localeCompare(right.exportName);
    }

    return left.namespace.localeCompare(right.namespace);
  });
};

const collectCollisions = (
  projectRootFiles: readonly BarritsFileIntegration[],
  projectDomains: readonly BarritsDomainIntegration[],
  libraryRootFiles: readonly BarritsFileIntegration[],
  libraryDomains: readonly BarritsDomainIntegration[],
): BarritsExportCollision[] => {
  const projectEntries = collectPublicNamespaceEntries(projectRootFiles, projectDomains);
  const libraryEntries = collectPublicNamespaceEntries(libraryRootFiles, libraryDomains);
  const collisions: BarritsExportCollision[] = [];
  const projectNamespaces = new Map<string, string>();
  const libraryNamespaces = new Map<string, string>();

  for (const entry of projectEntries) {
    const collisionKey = `${entry.namespace}:${entry.exportName}`;
    const existingSourceFile = projectNamespaces.get(collisionKey);

    if (existingSourceFile && existingSourceFile !== entry.sourceFile) {
      const existingIsAggregator = isAggregatorFile(existingSourceFile);
      const currentIsAggregator = isAggregatorFile(entry.sourceFile);

      if (existingIsAggregator !== currentIsAggregator) {
        if (!currentIsAggregator) {
          projectNamespaces.set(collisionKey, entry.sourceFile);
        }

        continue;
      }

      collisions.push({
        type: "project-project",
        namespace: entry.namespace,
        exportName: entry.exportName,
        projectSourceFile: existingSourceFile,
        conflictSourceFile: entry.sourceFile,
        message: `Export collision for ${entry.namespace}.${entry.exportName}: ${existingSourceFile} and ${entry.sourceFile} resolve to the same namespace path. Use @barrits-path to disambiguate.`,
      });
      continue;
    }

    projectNamespaces.set(collisionKey, entry.sourceFile);
  }

  for (const entry of libraryEntries) {
    libraryNamespaces.set(`${entry.namespace}:${entry.exportName}`, entry.sourceFile);
  }

  for (const [collisionKey, projectSourceFile] of projectNamespaces.entries()) {
    const librarySourceFile = libraryNamespaces.get(collisionKey);

    if (!librarySourceFile) {
      continue;
    }

    const [namespace, exportName] = collisionKey.split(":");

    collisions.push({
      type: "project-library",
      namespace,
      exportName,
      projectSourceFile,
      conflictSourceFile: librarySourceFile,
      librarySourceFile,
      message: `Export collision for ${namespace}.${exportName}: ${projectSourceFile} already exists and barrits_lib adds ${librarySourceFile}.`,
    });
  }

  return collisions.sort((left, right) => {
    if (left.namespace === right.namespace) {
      return left.exportName.localeCompare(right.exportName);
    }

    return left.namespace.localeCompare(right.namespace);
  });
};

const collectMergedExports = (
  files: readonly BarritsFileIntegration[],
  matcher: (file: BarritsFileIntegration) => boolean,
): BarritsFileExport[] => {
  const exportsMap = new Map<string, BarritsFileExport>();

  for (const file of files) {
    if (!matcher(file)) {
      continue;
    }

    for (const exportedMember of file.exports) {
      if (exportedMember.visibility !== "public") {
        continue;
      }

      exportsMap.set(exportedMember.name, exportedMember);
    }
  }

  return Array.from(exportsMap.values()).sort((left, right) => left.name.localeCompare(right.name));
};

const collectTraitDescriptors = (files: readonly BarritsFileIntegration[]): BarritsTraitDescriptorInspection[] => {
  return files
    .flatMap((file) => file.traitDescriptors)
    .sort((left, right) => {
      if (left.name === right.name) {
        return left.sourceFile.localeCompare(right.sourceFile);
      }

      return left.name.localeCompare(right.name);
    });
};

const collectTraitDiagnostics = (
  descriptors: readonly BarritsTraitDescriptorInspection[],
  bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>,
): BarritsTraitDiagnostic[] => {
  const diagnostics: BarritsTraitDiagnostic[] = [];
  const descriptorsByName = new Map<string, BarritsTraitDescriptorInspection[]>();
  const descriptorsByCapability = new Map<string, BarritsTraitDescriptorInspection[]>();

  for (const descriptor of descriptors) {
    const matchingNames = descriptorsByName.get(descriptor.name) ?? [];
    matchingNames.push(descriptor);
    descriptorsByName.set(descriptor.name, matchingNames);

    for (const capabilityName of descriptor.provides) {
      const matchingCapabilities = descriptorsByCapability.get(capabilityName) ?? [];
      matchingCapabilities.push(descriptor);
      descriptorsByCapability.set(capabilityName, matchingCapabilities);
    }
  }

  const createTraitDiagnostic = (
    diagnostic: Omit<BarritsTraitDiagnostic, "category">,
  ): BarritsTraitDiagnostic => {
    switch (diagnostic.code) {
      case "trait-conflicts-mismatch":
      case "trait-consumes-mismatch":
      case "trait-name-mismatch":
      case "trait-provides-mismatch":
      case "trait-requires-mismatch":
      case "trait-state-mismatch":
        return { ...diagnostic, category: "drift" };
      case "trait-duplicate-name":
      case "trait-requires-conflict-overlap":
      case "trait-self-conflict":
      case "trait-self-requires":
        return { ...diagnostic, category: "impossible" };
      case "trait-duplicate-provides":
      case "trait-missing-consumed-capability":
      case "trait-missing-required-trait":
      case "trait-unsupported-factory":
        return { ...diagnostic, category: "non-verifiable" };
    }
  };

  for (const descriptor of descriptors) {
    if (descriptor.requires.includes(descriptor.name)) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-self-requires",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside requires in ${descriptor.sourceFile}. A trait cannot depend on its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    if (descriptor.conflicts.includes(descriptor.name)) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-self-conflict",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" declares itself inside conflicts in ${descriptor.sourceFile}. A trait cannot be incompatible with its own identity.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const contradictoryDependencies = descriptor.requires.filter((requiredName) => descriptor.conflicts.includes(requiredName));

    if (contradictoryDependencies.length > 0) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-requires-conflict-overlap",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" both requires and conflicts with [${contradictoryDependencies.join(", ")}] in ${descriptor.sourceFile}. Dependency and incompatibility contracts must not overlap.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const missingRequiredTraits = descriptor.requires.filter((requiredName) => !descriptorsByName.has(requiredName));

    for (const missingRequiredTrait of missingRequiredTraits) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-missing-required-trait",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" requires "${missingRequiredTrait}" in ${descriptor.sourceFile}, but that trait was not found among the inspected trait descriptors. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    const missingConsumedCapabilities = descriptor.consumes.filter((capabilityName) => {
      if (descriptorsByCapability.has(capabilityName)) {
        return false;
      }

      return !descriptor.requires.includes(capabilityName);
    });

    for (const missingConsumedCapability of missingConsumedCapabilities) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-missing-consumed-capability",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" consumes "${missingConsumedCapability}" in ${descriptor.sourceFile}, but that capability was not found among the inspected trait providers. The contract may still be satisfied externally, but the current portable graph cannot verify it.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
        capabilityName: missingConsumedCapability,
      }));
    }

    if (!descriptor.factory) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-unsupported-factory",
        severity: "warning",
        message: `Trait descriptor "${descriptor.name}" is attached to export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but no supported factory call was detected nearby. Prefer createTraitDescriptor() or createTraitDescriptorFromJsDoc().`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
      continue;
    }

    if (descriptor.factory !== "createTraitDescriptor") {
      continue;
    }

    const binding = bindingsBySourceFile
      .get(descriptor.sourceFile)
      ?.find((entry) => entry.bindingName === descriptor.bindingName);

    if (binding?.runtimeName && binding.runtimeName !== descriptor.name) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-name-mismatch",
        severity: "error",
        message: `Trait descriptor "${descriptor.name}" documents export "${descriptor.bindingName}" in ${descriptor.sourceFile}, but createTraitDescriptor() declares runtime name "${binding.runtimeName}". Keep JSDoc and runtime trait identity aligned.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
      }));
    }

    if (binding?.runtimeProvides) {
      const documentedProvides = descriptor.provides.join(",");
      const runtimeProvides = binding.runtimeProvides.join(",");

      if (documentedProvides !== runtimeProvides) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-provides-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents provides [${descriptor.provides.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeProvides.join(", ")}] in ${descriptor.sourceFile}. Keep portable metadata aligned with runtime capabilities.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeConflicts) {
      const documentedConflicts = descriptor.conflicts.join(",");
      const runtimeConflicts = binding.runtimeConflicts.join(",");

      if (documentedConflicts !== runtimeConflicts) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-conflicts-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents conflicts [${descriptor.conflicts.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeConflicts.join(", ")}] in ${descriptor.sourceFile}. Keep incompatibility metadata aligned with runtime composition policy.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeRequires) {
      const documentedRequires = descriptor.requires.join(",");
      const runtimeRequires = binding.runtimeRequires.join(",");

      if (documentedRequires !== runtimeRequires) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-requires-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents requires [${descriptor.requires.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeRequires.join(", ")}] in ${descriptor.sourceFile}. Keep dependency metadata aligned with runtime composition order.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeConsumes) {
      const documentedConsumes = descriptor.consumes.join(",");
      const runtimeConsumes = binding.runtimeConsumes.join(",");

      if (documentedConsumes !== runtimeConsumes) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-consumes-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents consumes [${descriptor.consumes.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeConsumes.join(", ")}] in ${descriptor.sourceFile}. Keep capability dependency metadata aligned with runtime expectations.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }

    if (binding?.runtimeState) {
      const documentedState = descriptor.state.join(",");
      const runtimeState = binding.runtimeState.join(",");

      if (documentedState !== runtimeState) {
        diagnostics.push(createTraitDiagnostic({
          code: "trait-state-mismatch",
          severity: "warning",
          message: `Trait descriptor "${descriptor.name}" documents state [${descriptor.state.join(", ")}], but createTraitDescriptor() declares [${binding.runtimeState.join(", ")}] in ${descriptor.sourceFile}. Keep state ownership metadata aligned with runtime slots.`,
          sourceFile: descriptor.sourceFile,
          descriptorName: descriptor.name,
          bindingName: descriptor.bindingName,
        }));
      }
    }
  }

  for (const [descriptorName, matchingDescriptors] of descriptorsByName.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-duplicate-name",
        severity: "error",
        message: `Trait descriptor "${descriptorName}" is declared more than once across inspected files. Keep trait names globally stable and unique.`,
        sourceFile: descriptor.sourceFile,
        descriptorName,
        bindingName: descriptor.bindingName,
      }));
    }
  }

  for (const [capabilityName, matchingDescriptors] of descriptorsByCapability.entries()) {
    if (matchingDescriptors.length <= 1) {
      continue;
    }

    for (const descriptor of matchingDescriptors) {
      diagnostics.push(createTraitDiagnostic({
        code: "trait-duplicate-provides",
        severity: "warning",
        message: `Trait capability "${capabilityName}" is declared by multiple inspected traits. This may be intentional, but usually deserves explicit conflict policy or clearer ownership.`,
        sourceFile: descriptor.sourceFile,
        descriptorName: descriptor.name,
        bindingName: descriptor.bindingName,
        capabilityName,
      }));
    }
  }

  return diagnostics.sort((left, right) => {
    if (left.severity === right.severity) {
      if (left.code === right.code) {
        if (left.descriptorName === right.descriptorName) {
          return left.sourceFile.localeCompare(right.sourceFile);
        }

        return (left.descriptorName ?? "").localeCompare(right.descriptorName ?? "");
      }

      return left.code.localeCompare(right.code);
    }

    return left.severity.localeCompare(right.severity);
  });
};

const planImportActions = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
): BarritsImportAction[] => {
  const actions = new Map<string, BarritsImportAction>();
  const apiDomain = domains.find((domain) => domain.name === "api");

  const pushAction = (action: BarritsImportAction): void => {
    actions.set(`${action.exportName}:${action.kind}:${action.statement}`, action);
  };

  if (apiDomain) {
    for (const exportedMember of collectMergedExports(apiDomain.files, (file) => file.path === "api/flat.ts")) {
      pushAction({
        exportName: exportedMember.name,
        domain: "api",
        sourceFile: "api/flat.ts",
        kind: "named-import",
        statement: `import { ${exportedMember.name} } from "barrits";`,
      });
    }
  }

  for (const domain of domains) {
    if (domain.name === "api") {
      continue;
    }

    const domainExports = new Map<string, { sourceFile: string; exportedMember: BarritsFileExport }>();

    for (const file of domain.files) {
      if (file.kind === "internal") {
        continue;
      }

      for (const exportedMember of file.exports) {
        if (exportedMember.visibility !== "public") {
          continue;
        }

        if (!domainExports.has(exportedMember.accessPath)) {
          domainExports.set(exportedMember.accessPath, {
            sourceFile: file.path,
            exportedMember,
          });
        }
      }
    }

    for (const { sourceFile, exportedMember } of Array.from(domainExports.values()).sort((left, right) => {
      return left.exportedMember.accessPath.localeCompare(right.exportedMember.accessPath);
    })) {
      if (exportedMember.accessPath === domain.name) {
        continue;
      }

      pushAction({
        exportName: exportedMember.accessPath,
        domain: domain.name,
        sourceFile,
        kind: "namespace-access",
        statement: `barrits.${domain.name}.${exportedMember.accessPath}`,
      });

      pushAction({
        exportName: exportedMember.accessPath,
        domain: domain.name,
        sourceFile,
        kind: "alias-namespace-access",
        statement: `brt.${domain.name}.${exportedMember.accessPath}`,
      });
    }
  }

  for (const exportedMember of collectMergedExports(rootFiles, (file) => file.path === "index.ts")) {
    pushAction({
      exportName: exportedMember.name,
      domain: "root",
      sourceFile: "index.ts",
      kind: "named-import",
      statement: `import { ${exportedMember.name} } from "barrits";`,
    });
  }

  return Array.from(actions.values()).sort((left, right) => {
    if (left.exportName === right.exportName) {
      return left.kind.localeCompare(right.kind);
    }

    return left.exportName.localeCompare(right.exportName);
  });
};

export const inspectBarritsIntegrations = async (
  adapter: RuntimeFileSystemAdapter,
  discovery: BarritsDiscovery,
): Promise<BarritsIntegrationGraph> => {
  const projectLayer = await inspectLayer(adapter, discovery.barritsDirectory, "barrits");
  const rootFiles = mergeRootFiles(projectLayer.rootFiles, []);
  const domains = mergeDomains(projectLayer.domains, []);
  const inspectedFiles = [...projectLayer.files];
  const exportsCount = inspectedFiles.reduce((count, file) => count + file.exports.length, 0);
  const publicExportsCount = inspectedFiles.reduce(
    (count, file) => count + file.exports.filter((entry) => entry.visibility === "public").length,
    0,
  );
  const internalExportsCount = exportsCount - publicExportsCount;
  const barrelsCount = inspectedFiles.filter((file) => file.kind === "barrel" || file.kind === "root").length;
  const traitDescriptors = collectTraitDescriptors(inspectedFiles);
  const bindingsBySourceFile = new Map<string, readonly ExportedTraitBinding[]>();

  for (const file of inspectedFiles) {
    if (file.kind !== "trait") {
      continue;
    }

    const absolutePath = joinPath(discovery.barritsDirectory, file.path);
    const source = await adapter.readTextFile(absolutePath);
    bindingsBySourceFile.set(file.path, collectExportedTraitBindings(source, file.path));
  }

  const traitDiagnostics = collectTraitDiagnostics(traitDescriptors, bindingsBySourceFile);
  const collisions = collectCollisions(rootFiles, domains, [], []);
  const importActions = planImportActions(rootFiles, domains);

  return {
    barritsDirectory: discovery.barritsDirectory,
    projectRoot: discovery.projectRoot,
    strategy: discovery.strategy,
    rootFiles,
    domains,
    libraryRootFiles: [],
    libraryDomains: [],
    filesCount: inspectedFiles.length,
    exportsCount,
    publicExportsCount,
    internalExportsCount,
    barrelsCount,
    traitDescriptors,
    traitDiagnostics,
    importActions,
    collisions,
  };
};