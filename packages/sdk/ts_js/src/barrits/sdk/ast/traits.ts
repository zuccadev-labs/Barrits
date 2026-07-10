import ts from "typescript";
import { parseTraitDescriptorJsDoc } from "../../traits/descriptor";
import { createCachedSourceFile } from "./cache";
import { extractAttachedJsDoc, hasExportModifier } from "./extractor";
import { normalizePath } from "../path";
import type { BarritsTraitDescriptorInspection } from "../contracts";
import type { BarritsTraitContractConfig } from "../../config";

/**
 * [EN] Type definition for ExportedTraitBinding.
 * [ES] Definición de tipo para ExportedTraitBinding.
 */
export type ExportedTraitBinding = {
  /** [EN] Binding kind. [ES] Binding tipo. */
  readonly bindingKind: "const" | "function" | "class";
  /** [EN] Binding name. [ES] Binding nombre. */
  readonly bindingName: string;
  /** [EN] Match index. [ES] Match índice. */
  readonly matchIndex: number;
  /** [EN] Runtime conflicts. [ES] Entorno de ejecución conflictos. */
  readonly runtimeConflicts?: readonly string[];
  /** [EN] Factory. [ES] Factory. */
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  /** [EN] Runtime consumes. [ES] Entorno de ejecución consume. */
  readonly runtimeConsumes?: readonly string[];
  /** [EN] Runtime name. [ES] Entorno de ejecución nombre. */
  readonly runtimeName?: string;
  /** [EN] Runtime requires. [ES] Entorno de ejecución requiere. */
  readonly runtimeRequires?: readonly string[];
  /** [EN] Runtime provides. [ES] Entorno de ejecución proporciona. */
  readonly runtimeProvides?: readonly string[];
  /** [EN] Runtime state. [ES] Entorno de ejecución estado. */
  readonly runtimeState?: readonly string[];
};

/**
 * [EN] Type definition for TraitRuntimeMetadata.
 * [ES] Definición de tipo para TraitRuntimeMetadata.
 */
export type TraitRuntimeMetadata = {
  /** [EN] Conflicts. [ES] Conflictos. */
  readonly conflicts?: readonly string[];
  /** [EN] Consumes. [ES] Consume. */
  readonly consumes?: readonly string[];
  /** [EN] Name. [ES] Nombre. */
  readonly name?: string;
  /** [EN] Requires. [ES] Requiere. */
  readonly requires?: readonly string[];
  /** [EN] Provides. [ES] Proporciona. */
  readonly provides?: readonly string[];
  /** [EN] State. [ES] Estado. */
  readonly state?: readonly string[];
};

/**
 * Resolves deeply nested semantic abstract factories evaluating expression tree architectures mapped targeting capability creation.
 *
 * @param expression - Typescript logic interface binding literal root syntax expression node component dependency pointer.
 * @returns Resolves the factory literal identifier string natively mapped.
 */
const resolveWrapExpression = (expression: ts.Expression): ReturnType<typeof resolveTraitDescriptorFactoryFromExpression> => {
  if (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isNonNullExpression(expression)
  ) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  if (ts.isAwaitExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.expression);
  }

  return undefined;
};

const resolveBinaryExpression = (
  expression: ts.BinaryExpression | ts.ConditionalExpression,
): ReturnType<typeof resolveTraitDescriptorFactoryFromExpression> => {
  if (ts.isBinaryExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.left) ?? resolveTraitDescriptorFactoryFromExpression(expression.right);
  }

  return (
    resolveTraitDescriptorFactoryFromExpression(expression.whenTrue) ?? resolveTraitDescriptorFactoryFromExpression(expression.whenFalse)
  );
};

/**
 * [EN] Resolves a trait descriptor factory name from a TypeScript call expression AST node.
 * [ES] Resuelve el nombre de una fábrica de descriptores de traits desde un nodo AST de expresión de llamada TypeScript.
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

    return (
      resolveTraitDescriptorFactoryFromExpression(expression.expression) ??
      expression.arguments.map((argument) => resolveTraitDescriptorFactoryFromExpression(argument)).find(Boolean)
    );
  }

  const wrappedResult = resolveWrapExpression(expression);
  if (wrappedResult !== undefined) {
    return wrappedResult;
  }

  if (ts.isConditionalExpression(expression) || ts.isBinaryExpression(expression)) {
    return resolveBinaryExpression(expression);
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

  const fields: Record<string, { values: readonly string[] | undefined; isDynamic: boolean }> = {
    provides: { values: undefined, isDynamic: false },
    conflicts: { values: [], isDynamic: false },
    requires: { values: [], isDynamic: false },
    consumes: { values: [], isDynamic: false },
    state: { values: [], isDynamic: false },
  };
  let runtimeName: string | undefined;

  for (const property of descriptorArgument.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) {
      continue;
    }

    const propName = property.name.text;

    if (propName === "name") {
      if (ts.isStringLiteralLike(property.initializer)) {
        runtimeName = property.initializer.text.trim() || undefined;
      }
      continue;
    }

    const field = fields[propName];

    if (field) {
      const parsed = readStringArrayLiteral(property.initializer);
      field.values = parsed ?? field.values;
      field.isDynamic = parsed === undefined;
    }
  }

  return {
    conflicts: fields.conflicts.isDynamic ? undefined : fields.conflicts.values,
    consumes: fields.consumes.isDynamic ? undefined : fields.consumes.values,
    name: runtimeName,
    requires: fields.requires.isDynamic ? undefined : fields.requires.values,
    provides: fields.provides.isDynamic ? undefined : fields.provides.values,
    state: fields.state.isDynamic ? undefined : fields.state.values,
  };
};

/**
 * Sweeps the AST structure explicitly collecting export bindings matching trait payload creation routines mapping signatures recursively natively traversing explicit modifiers.
 */
const collectConstVariableTraitBindings = (statement: ts.VariableStatement, sourceFile: ts.SourceFile): ExportedTraitBinding[] => {
  if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
    return [];
  }

  const bindings: ExportedTraitBinding[] = [];

  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name)) {
      continue;
    }

    const runtimeMetadata = readTraitRuntimeMetadataFromCall(declaration.initializer);
    const matchIndex = statement.getStart(sourceFile);

    bindings.push({
      bindingKind: "const",
      bindingName: declaration.name.text,
      matchIndex,
      runtimeConflicts: runtimeMetadata?.conflicts,
      runtimeConsumes: runtimeMetadata?.consumes,
      factory: resolveTraitDescriptorFactoryFromExpression(declaration.initializer),
      runtimeName: runtimeMetadata?.name,
      runtimeRequires: runtimeMetadata?.requires,
      runtimeProvides: runtimeMetadata?.provides,
      runtimeState: runtimeMetadata?.state,
    });
  }

  return bindings;
};

/**
 * [EN] Collects all exported trait bindings (const, function, class) from a source file's AST.
 * [ES] Recolecta todos los bindings de traits exportados (const, function, class) desde el AST de un archivo fuente.
 */
export const collectExportedTraitBindings = (source: string, relativePath: string): ExportedTraitBinding[] => {
  const sourceFile = createCachedSourceFile(relativePath, source);
  const bindings: ExportedTraitBinding[] = [];

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
      bindings.push(...collectConstVariableTraitBindings(statement, sourceFile));
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

/**
 * [EN] Implementation of Normalize contract string array.
 * [ES] Implementación de Normalize contract string array.
 */
export const normalizeContractStringArray = (values: readonly string[] | undefined): string[] => {
  if (!values?.length) {
    return [];
  }

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((left, right) => {
    return left.localeCompare(right);
  });
};

/**
 * [EN] Implementation of To trait contract descriptor.
 * [ES] Implementación de To trait contract descriptor.
 */
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

/**
 * [EN] Implementation of Merge trait descriptors.
 * [ES] Implementación de Merge trait descriptors.
 */
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
