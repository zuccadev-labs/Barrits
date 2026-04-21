import ts from "typescript";
import { parseTraitDescriptorJsDoc } from "../../traits/descriptor";
import { createCachedSourceFile } from "./cache";
import { extractAttachedJsDoc, hasExportModifier } from "./extractor";
import { normalizePath } from "../path";
import type { 
  BarritsTraitDescriptorInspection, 
  BarritsTraitDiagnostic,
} from "../contracts";
import type { BarritsTraitContractConfig } from "../../config";

export type ExportedTraitBinding = {
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

export type TraitRuntimeMetadata = {
  readonly conflicts?: readonly string[];
  readonly consumes?: readonly string[];
  readonly name?: string;
  readonly requires?: readonly string[];
  readonly provides?: readonly string[];
  readonly state?: readonly string[];
};

/**
 * Resolves deeply nested semantic abstract factories evaluating expression tree architectures mapped targeting capability creation.
 *
 * @param expression - Typescript logic interface binding literal root syntax expression node component dependency pointer.
 * @returns Resolves the factory literal identifier string natively mapped.
 */
export const resolveTraitDescriptorFactoryFromExpression = (
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

/**
 * Parses a TypeScript Array Literal node mapping plain text constants mapping primitive string interfaces.
 */
export const readStringArrayLiteral = (expression: ts.Expression | undefined): string[] | undefined => {
  if (!expression || !ts.isArrayLiteralExpression(expression)) {
    return undefined;
  }

  const values = expression.elements
    .filter((element): element is ts.StringLiteralLike => ts.isStringLiteralLike(element))
    .map((element) => element.text.trim())
    .filter(Boolean);

  return values.length > 0 ? Array.from(new Set(values)).sort((left, right) => left.localeCompare(right)) : [];
};

/**
 * Parses internal explicit argument objects targeting explicit trait mapping dependencies evaluating structural runtime property maps.
 */
export const readTraitRuntimeMetadataFromCall = (expression: ts.Expression | undefined): TraitRuntimeMetadata | undefined => {
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

/**
 * Sweeps the AST structure explicitly collecting export bindings matching trait payload creation routines mapping signatures recursively natively traversing explicit modifiers.
 */
export const collectExportedTraitBindings = (source: string, relativePath: string): ExportedTraitBinding[] => {
  const sourceFile = createCachedSourceFile(relativePath, source);
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

/**
 * Builds physical meta-descriptor objects parsing logical block JSDocs overriding payload identifiers.
 * Traces context pointers securely parsing traits without side-effects or heavy runtime impact.
 */
export const collectTraitDescriptorMetadata = (source: string, relativePath: string): BarritsTraitDescriptorInspection[] => {
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

export const normalizeContractStringArray = (values: readonly string[] | undefined): string[] => {
  if (!values?.length) {
    return [];
  }

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((left, right) => {
    return left.localeCompare(right);
  });
};

export const toTraitContractDescriptor = (contract: BarritsTraitContractConfig): BarritsTraitDescriptorInspection | null => {
  const sourceFile = normalizePath(contract.sourceFile).replace(/^\.\//u, "");
  const name = contract.name.trim();
  const bindingName = contract.bindingName.trim();

  if (!sourceFile || !name || !bindingName) {
    return null;
  }

  return {
    name,
    sourceFile,
    bindingName,
    bindingKind: contract.bindingKind ?? "const",
    factory: contract.factory,
    summary: contract.summary?.trim() || undefined,
    requires: normalizeContractStringArray(contract.requires),
    conflicts: normalizeContractStringArray(contract.conflicts),
    state: normalizeContractStringArray(contract.state),
    consumes: normalizeContractStringArray(contract.consumes),
    provides: normalizeContractStringArray(contract.provides),
    tags: normalizeContractStringArray(contract.tags),
    runtimes: normalizeContractStringArray(contract.runtimes),
  };
};

export const mergeTraitDescriptors = (
  discoveredDescriptors: readonly BarritsTraitDescriptorInspection[],
  contractDescriptors: readonly BarritsTraitDescriptorInspection[],
): BarritsTraitDescriptorInspection[] => {
  const merged = new Map<string, BarritsTraitDescriptorInspection>();

  for (const descriptor of [...discoveredDescriptors, ...contractDescriptors]) {
    const key = `${descriptor.sourceFile}::${descriptor.bindingName}`;
    const existingDescriptor = merged.get(key);

    if (!existingDescriptor) {
      merged.set(key, descriptor);
      continue;
    }

    merged.set(key, {
      ...existingDescriptor,
      ...descriptor,
      bindingKind: descriptor.bindingKind ?? existingDescriptor.bindingKind,
      factory: descriptor.factory ?? existingDescriptor.factory,
      summary: descriptor.summary ?? existingDescriptor.summary,
    });
  }

  return Array.from(merged.values()).sort((left, right) => {
    if (left.name === right.name) {
      return left.sourceFile.localeCompare(right.sourceFile);
    }

    return left.name.localeCompare(right.name);
  });
};
