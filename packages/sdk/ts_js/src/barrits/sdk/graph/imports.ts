import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsImportAction, BarritsFileExport } from "../contracts";

/**
 * Filter exported interfaces natively targeting mapped module components resolving explicit interfaces mapping.
 */
export const collectMergedExports = (
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

const toSourceDomain = (sourceFile: string): string => {
  const [firstSegment] = sourceFile.split("/").filter(Boolean);
  return firstSegment ?? "root";
};

const pushAction = (
  actions: Map<string, BarritsImportAction>,
  action: BarritsImportAction,
): void => {
  actions.set(`${action.exportName}:${action.kind}:${action.statement}`, action);
};

const buildApiImportActions = (
  domains: readonly BarritsDomainIntegration[],
  actions: Map<string, BarritsImportAction>,
): void => {
  const apiDomain = domains.find((domain) => domain.name === "api");

  if (!apiDomain) {
    return;
  }

  for (const exportedMember of collectMergedExports(apiDomain.files, (file) => file.path === "api/flat.ts")) {
    pushAction(actions, {
      exportName: exportedMember.name,
      domain: "api",
      sourceFile: "api/flat.ts",
      kind: "named-import",
      statement: `import { ${exportedMember.name} } from "@zuccadev-labs/barrits";`,
    });
  }
};

const buildRootImportActions = (
  rootFiles: readonly BarritsFileIntegration[],
  actions: Map<string, BarritsImportAction>,
): Set<string> => {
  const rootNamedImportNames = new Set<string>();

  for (const exportedMember of collectMergedExports(rootFiles, (file) => file.path === "index.ts")) {
    if (exportedMember.visibility !== "public") {
      continue;
    }

    rootNamedImportNames.add(exportedMember.name);
    pushAction(actions, {
      exportName: exportedMember.name,
      domain: "root",
      sourceFile: "index.ts",
      kind: "named-import",
      statement: `import { ${exportedMember.name} } from "@zuccadev-labs/barrits";`,
    });
  }

  return rootNamedImportNames;
};

const buildNamedImportActions = (
  domains: readonly BarritsDomainIntegration[],
  rootNamedImportNames: Set<string>,
  actions: Map<string, BarritsImportAction>,
): void => {
  const namedImportNameCounts = new Map<string, number>();
  const firstNamedImportSourceByName = new Map<string, string>();

  for (const domain of domains) {
    if (domain.name === "api") {
      continue;
    }

    for (const file of domain.files) {
      if (file.kind === "internal") {
        continue;
      }

      for (const exportedMember of file.exports) {
        if (exportedMember.visibility !== "public") {
          continue;
        }

        if (rootNamedImportNames.has(exportedMember.name)) {
          continue;
        }

        if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(exportedMember.name)) {
          continue;
        }

        namedImportNameCounts.set(exportedMember.name, (namedImportNameCounts.get(exportedMember.name) ?? 0) + 1);

        if (!firstNamedImportSourceByName.has(exportedMember.name)) {
          firstNamedImportSourceByName.set(exportedMember.name, file.path);
        }
      }
    }
  }

  for (const [exportName, count] of Array.from(namedImportNameCounts.entries()).sort((left, right) => {
    return left[0].localeCompare(right[0]);
  })) {
    if (count !== 1) {
      continue;
    }

    const sourceFile = firstNamedImportSourceByName.get(exportName);

    if (!sourceFile) {
      continue;
    }

    pushAction(actions, {
      exportName,
      domain: toSourceDomain(sourceFile),
      sourceFile,
      kind: "named-import",
      statement: `import { ${exportName} } from "@zuccadev-labs/barrits";`,
    });
  }
};

const buildNamespaceImportActions = (
  domains: readonly BarritsDomainIntegration[],
  actions: Map<string, BarritsImportAction>,
): void => {
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

      pushAction(actions, {
        exportName: exportedMember.accessPath,
        domain: domain.name,
        sourceFile,
        kind: "namespace-access",
        statement: `barrits.${domain.name}.${exportedMember.accessPath}`,
      });

      pushAction(actions, {
        exportName: exportedMember.accessPath,
        domain: domain.name,
        sourceFile,
        kind: "alias-namespace-access",
        statement: `brt.${domain.name}.${exportedMember.accessPath}`,
      });
    }
  }
};

const sortImportActions = (actions: Map<string, BarritsImportAction>): BarritsImportAction[] => {
  return Array.from(actions.values()).sort((left, right) => {
    if (left.exportName === right.exportName) {
      return left.kind.localeCompare(right.kind);
    }

    return left.exportName.localeCompare(right.exportName);
  });
};

/**
 * Validates logical import aliases structurally planning deterministic namespace import patterns mapped globally.
 */
export const planImportActions = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
): BarritsImportAction[] => {
  const actions = new Map<string, BarritsImportAction>();

  buildApiImportActions(domains, actions);
  const rootNamedImportNames = buildRootImportActions(rootFiles, actions);
  buildNamedImportActions(domains, rootNamedImportNames, actions);
  buildNamespaceImportActions(domains, actions);

  return sortImportActions(actions);
};
