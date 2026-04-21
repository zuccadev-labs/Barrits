import fs from "fs";

const filepath = "src/barrits/sdk/inspect.ts";
let source = fs.readFileSync(filepath, "utf8");
let lines = source.split("\n");

// Remove ts import and prepend swc
lines = lines.filter(line => !line.includes('import ts from "typescript";'));
lines.unshift('import * as swc from "@swc/core";');

const swcBlock = `type ExportedTraitBinding = {
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

const resolveTraitDescriptorFactoryFromExpression = (
  expression: any | undefined,
): "createTraitDescriptor" | "createTraitDescriptorFromJsDoc" | undefined => {
  if (!expression) return undefined;

  if (expression.type === "CallExpression") {
    if (expression.callee?.type === "Identifier") {
      if (expression.callee.value === "createTraitDescriptorFromJsDoc") return "createTraitDescriptorFromJsDoc";
      if (expression.callee.value === "createTraitDescriptor") return "createTraitDescriptor";
    }

    return resolveTraitDescriptorFactoryFromExpression(expression.callee) ??
      expression.arguments.map((arg: any) => resolveTraitDescriptorFactoryFromExpression(arg.expression)).find(Boolean);
  }

  if (
    expression.type === "ParenthesisExpression" ||
    expression.type === "TsAsExpression" ||
    expression.type === "TsSatisfiesExpression" ||
    expression.type === "TsNonNullExpression"
  ) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  if (expression.type === "ConditionalExpression") {
    return resolveTraitDescriptorFactoryFromExpression(expression.consequent) ??
      resolveTraitDescriptorFactoryFromExpression(expression.alternate);
  }

  if (expression.type === "BinaryExpression") {
    return resolveTraitDescriptorFactoryFromExpression(expression.left) ??
      resolveTraitDescriptorFactoryFromExpression(expression.right);
  }

  if (expression.type === "AwaitExpression" || expression.type === "MemberExpression") {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression || expression.object);
  }

  return undefined;
};

const readStringArrayLiteral = (expression: any | undefined): string[] | undefined => {
  if (!expression || expression.type !== "ArrayExpression") return undefined;

  const values = expression.elements
    .filter((e: any) => e?.expression?.type === "StringLiteral")
    .map((e: any) => String(e.expression.value).trim())
    .filter(Boolean);

  return values.length > 0 ? Array.from(new Set<string>(values)).sort((left: string, right: string) => left.localeCompare(right)) : [];
};

const readTraitRuntimeMetadataFromCall = (expression: any | undefined): TraitRuntimeMetadata | undefined => {
  if (!expression || expression.type !== "CallExpression" || expression.callee.type !== "Identifier") return undefined;

  if (expression.callee.value !== "createTraitDescriptor") return undefined;

  const descriptorArgument = expression.arguments[0]?.expression;

  if (!descriptorArgument || descriptorArgument.type !== "ObjectExpression") return undefined;

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
    if (property.type !== "KeyValueProperty" || property.key.type !== "Identifier") continue;

    const name = property.key.value;
    const initializer = property.value;

    if (name === "name" && initializer.type === "StringLiteral") {
      runtimeName = initializer.value.trim() || undefined;
      continue;
    }

    if (name === "provides") {
      runtimeProvides = readStringArrayLiteral(initializer);
      hasDynamicProvides = runtimeProvides === undefined;
      continue;
    }

    if (name === "conflicts") {
      runtimeConflicts = readStringArrayLiteral(initializer) ?? [];
      hasDynamicConflicts = readStringArrayLiteral(initializer) === undefined;
      continue;
    }

    if (name === "requires") {
      runtimeRequires = readStringArrayLiteral(initializer) ?? [];
      hasDynamicRequires = readStringArrayLiteral(initializer) === undefined;
      continue;
    }

    if (name === "consumes") {
      runtimeConsumes = readStringArrayLiteral(initializer) ?? [];
      hasDynamicConsumes = readStringArrayLiteral(initializer) === undefined;
      continue;
    }

    if (name === "state") {
      runtimeState = readStringArrayLiteral(initializer) ?? [];
      hasDynamicState = readStringArrayLiteral(initializer) === undefined;
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
  const sourceFile = swc.parseSync(source, { syntax: "typescript", target: "esnext" });
  const bindings: ExportedTraitBinding[] = [];

  for (const statement of sourceFile.body) {
    if (statement.type === "ExportDeclaration") {
      const decl = statement.declaration;
      const matchIndex = statement.span.start - 1;

      if (decl.type === "VariableDeclaration" && decl.kind === "const") {
        for (const declaration of decl.declarations) {
          if (declaration.id.type !== "Identifier") continue;

          const runtimeMetadata = readTraitRuntimeMetadataFromCall(declaration.init);

          bindings.push({
            bindingKind: "const",
            bindingName: declaration.id.value,
            matchIndex,
            runtimeConflicts: runtimeMetadata?.conflicts,
            runtimeConsumes: runtimeMetadata?.consumes,
            factory: resolveTraitDescriptorFactoryFromExpression(declaration.init),
            runtimeName: runtimeMetadata?.name,
            runtimeRequires: runtimeMetadata?.requires,
            runtimeProvides: runtimeMetadata?.provides,
            runtimeState: runtimeMetadata?.state,
          });
        }
      } else if (decl.type === "FunctionDeclaration" && decl.identifier) {
        bindings.push({
          bindingKind: "function",
          bindingName: decl.identifier.value,
          matchIndex,
        });
      } else if (decl.type === "ClassDeclaration" && decl.identifier) {
        bindings.push({
          bindingKind: "class",
          bindingName: decl.identifier.value,
          matchIndex,
        });
      }
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

    const metadata = parseTraitDescriptorJsDoc(\`/**\${jsDocBlock}*/\`);

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
  const sourceFile = swc.parseSync(source, { syntax: "typescript", target: "esnext" });

  const pushExport = (name: string, kind: BarritsFileExport["kind"], matchIndex: number): void => {
    const normalizedName = name.trim();

    if (!normalizedName) return;

    const jsDocAccessPath = parseJsDocAccessPath(source, matchIndex);
    const derivedAccessPath = deriveExportAccessPath(relativePath, normalizedName);
    const accessPath = jsDocAccessPath ?? derivedAccessPath;
    const accessStrategy: BarritsExportAccessStrategy = jsDocAccessPath ? "jsdoc" : accessPath === normalizedName ? "export-name" : "file-system";

    exportsMap.set(normalizedName, {
      name: normalizedName,
      accessPath,
      accessStrategy,
      kind,
      visibility,
    });
  };

  for (const statement of sourceFile.body) {
    if (statement.type === "ExportDeclaration") {
      const matchIndex = statement.span.start - 1;
      const decl = statement.declaration;

      if (decl.type === "VariableDeclaration" && decl.kind === "const") {
        for (const declaration of decl.declarations) {
          if (declaration.id.type === "Identifier") {
            pushExport(declaration.id.value, "const", matchIndex);
          }
        }
      } else if (decl.type === "FunctionDeclaration" && decl.identifier) {
        pushExport(decl.identifier.value, "function", matchIndex);
      }
    } else if (statement.type === "ExportAllDeclaration") {
      exportAllSpecifiers.push(statement.source.value);
    } else if (statement.type === "ExportNamedDeclaration") {
      const matchIndex = statement.span.start - 1;

      for (const specifier of statement.specifiers) {
        if (specifier.type === "ExportSpecifier" && specifier.orig.type === "Identifier") {
          pushExport(specifier.orig.value, "reexport", matchIndex);
        }
      }
    }
  }

  return { exportsMap, exportAllSpecifiers };
};`;

// Line 202 is zero base 201 because of our prepend.
// But we actually inserted a line at index 0 and took one out, so numbering remains exactly the same!
// Actually wait! If we filtered lines, the indices shifted if 'import ts' was not the first element!
// The safe approach is to find the indices of the boundaries dynamically:

const startIndex = lines.findIndex(l => l.startsWith("type ExportedTraitBinding"));
const endIndex = lines.findIndex(l => l.startsWith("const extractExports = async"));

if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not find patch boundaries!");
}

const newLines = [
  ...lines.slice(0, startIndex),
  swcBlock,
  ...lines.slice(endIndex)
];

fs.writeFileSync(filepath, newLines.join("\n"), "utf8");
console.log("Successfully line-patched inspect.ts with dynamic boundaries");
