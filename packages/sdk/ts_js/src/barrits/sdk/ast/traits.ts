import type * as TypeScript from "typescript";
import { parseTraitDescriptorJsDoc } from "../../traits/descriptor";
import { createCachedSourceFile, requireTypeScript } from "./cache";
import { getAttachedJsDoc, hasExportModifier } from "./extractor";
import { normalizePath } from "../path";
import type { BarritsTraitDescriptorInspection } from "../contracts";
import type { BarritsTraitContractConfig } from "../../config";

/**
 * [EN] Exported binding found in a trait file, with the runtime metadata read from a `createTraitDescriptor()` call
 * (when statically analyzable) and the JSDoc block the parser attached to it.
 * [ES] Binding exportado hallado en un archivo de traits, con los metadatos runtime leídos de una llamada
 * `createTraitDescriptor()` (cuando son analizables estáticamente) y el bloque JSDoc que el parser le asoció.
 */
export type ExportedTraitBinding = {
  /** [EN] Binding kind. [ES] Tipo de binding. */
  readonly bindingKind: "const" | "function" | "class";
  /** [EN] Binding name. [ES] Nombre del binding. */
  readonly bindingName: string;
  /** [EN] Start offset of the declaration in the source. [ES] Desplazamiento inicial de la declaración en el fuente. */
  readonly matchIndex: number;
  /** [EN] Inner text of the attached JSDoc block, if any. [ES] Texto interior del bloque JSDoc asociado, si existe. */
  readonly jsDoc?: string;
  /** [EN] Conflicts declared at runtime (undefined when dynamic). [ES] Conflictos declarados en runtime (undefined si son dinámicos). */
  readonly runtimeConflicts?: readonly string[];
  /** [EN] Factory used by the initializer. [ES] Factoría usada por el inicializador. */
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  /** [EN] Capabilities consumed at runtime. [ES] Capacidades consumidas en runtime. */
  readonly runtimeConsumes?: readonly string[];
  /** [EN] Trait name declared at runtime. [ES] Nombre del trait declarado en runtime. */
  readonly runtimeName?: string;
  /** [EN] Traits required at runtime. [ES] Traits requeridos en runtime. */
  readonly runtimeRequires?: readonly string[];
  /** [EN] Capabilities provided at runtime. [ES] Capacidades proporcionadas en runtime. */
  readonly runtimeProvides?: readonly string[];
  /** [EN] State keys declared at runtime. [ES] Claves de estado declaradas en runtime. */
  readonly runtimeState?: readonly string[];
};

/**
 * [EN] Runtime metadata statically readable from a `createTraitDescriptor({...})` literal.
 * [ES] Metadatos runtime legibles estáticamente desde un literal `createTraitDescriptor({...})`.
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

const resolveWrapExpression = (expression: TypeScript.Expression): ReturnType<typeof resolveTraitDescriptorFactoryFromExpression> => {
  const ts = requireTypeScript();

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
  expression: TypeScript.BinaryExpression | TypeScript.ConditionalExpression,
): ReturnType<typeof resolveTraitDescriptorFactoryFromExpression> => {
  const ts = requireTypeScript();

  if (ts.isBinaryExpression(expression)) {
    return resolveTraitDescriptorFactoryFromExpression(expression.left) ?? resolveTraitDescriptorFactoryFromExpression(expression.right);
  }

  return (
    resolveTraitDescriptorFactoryFromExpression(expression.whenTrue) ?? resolveTraitDescriptorFactoryFromExpression(expression.whenFalse)
  );
};

/**
 * [EN] Resolves which trait factory (if any) an initializer expression ends up calling, looking through
 * parentheses, casts, awaits, property accesses, ternaries and binary expressions.
 * [ES] Resuelve qué factoría de traits (si alguna) acaba llamando una expresión inicializadora, atravesando
 * paréntesis, casts, awaits, accesos a propiedades, ternarios y expresiones binarias.
 */
export const resolveTraitDescriptorFactoryFromExpression = (
  expression: TypeScript.Expression | undefined,
): "createTraitDescriptor" | "createTraitDescriptorFromJsDoc" | undefined => {
  if (!expression) {
    return undefined;
  }

  const ts = requireTypeScript();

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
 * [EN] Reads a string-literal array literal as a sorted, de-duplicated list; returns undefined for anything else
 * (dynamic expressions cannot be verified statically).
 * [ES] Lee un literal de array de strings como lista ordenada y deduplicada; devuelve undefined para cualquier otra
 * cosa (las expresiones dinámicas no pueden verificarse estáticamente).
 */
export const readStringArrayLiteral = (expression: TypeScript.Expression | undefined): string[] | undefined => {
  const ts = requireTypeScript();

  if (!expression || !ts.isArrayLiteralExpression(expression)) {
    return undefined;
  }

  const values = expression.elements
    .filter((element): element is TypeScript.StringLiteralLike => ts.isStringLiteralLike(element))
    .map((element) => element.text.trim())
    .filter(Boolean);

  return values.length > 0 ? Array.from(new Set(values)).sort((left, right) => left.localeCompare(right)) : [];
};

/**
 * [EN] Reads the statically analyzable fields (`name`, `provides`, `conflicts`, `requires`, `consumes`, `state`)
 * of a `createTraitDescriptor({...})` call; dynamic fields resolve to undefined.
 * [ES] Lee los campos analizables estáticamente (`name`, `provides`, `conflicts`, `requires`, `consumes`, `state`)
 * de una llamada `createTraitDescriptor({...})`; los campos dinámicos resuelven a undefined.
 */
export const readTraitRuntimeMetadataFromCall = (expression: TypeScript.Expression | undefined): TraitRuntimeMetadata | undefined => {
  const ts = requireTypeScript();

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

const collectConstVariableTraitBindings = (
  statement: TypeScript.VariableStatement,
  sourceFile: TypeScript.SourceFile,
): ExportedTraitBinding[] => {
  const ts = requireTypeScript();

  if ((statement.declarationList.flags & ts.NodeFlags.Const) === 0) {
    return [];
  }

  const bindings: ExportedTraitBinding[] = [];
  const jsDoc = getAttachedJsDoc(statement, sourceFile);
  const matchIndex = statement.getStart(sourceFile);

  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name)) {
      continue;
    }

    const runtimeMetadata = readTraitRuntimeMetadataFromCall(declaration.initializer);

    bindings.push({
      bindingKind: "const",
      bindingName: declaration.name.text,
      matchIndex,
      jsDoc,
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
 * [EN] Collects all exported trait bindings (const, function, class) from a source file's AST, including the
 * JSDoc block the parser attached to each declaration. Requires the TypeScript compiler API to be loaded.
 * [ES] Recolecta todos los bindings de traits exportados (const, function, class) desde el AST de un archivo fuente,
 * incluido el bloque JSDoc que el parser asoció a cada declaración. Requiere la API del compilador cargada.
 */
export const collectExportedTraitBindings = (source: string, relativePath: string): ExportedTraitBinding[] => {
  const ts = requireTypeScript();
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
        jsDoc: getAttachedJsDoc(statement, sourceFile),
      });
      continue;
    }

    if (ts.isClassDeclaration(statement) && hasExportModifier(statement) && statement.name) {
      bindings.push({
        bindingKind: "class",
        bindingName: statement.name.text,
        matchIndex: statement.getStart(sourceFile),
        jsDoc: getAttachedJsDoc(statement, sourceFile),
      });
    }
  }

  return bindings;
};

/**
 * [EN] Builds trait descriptor inspections from the exported bindings whose attached JSDoc declares
 * `@barrits-trait`. Attachment follows the TypeScript parser, so unrelated comments never leak a trait onto the
 * next export.
 * [ES] Construye inspecciones de descriptores de trait a partir de los bindings exportados cuyo JSDoc asociado declara
 * `@barrits-trait`. La asociación sigue al parser de TypeScript, por lo que comentarios ajenos nunca filtran un trait
 * al siguiente export.
 */
export const collectTraitDescriptorMetadata = (source: string, relativePath: string): BarritsTraitDescriptorInspection[] => {
  const descriptors: BarritsTraitDescriptorInspection[] = [];

  for (const binding of collectExportedTraitBindings(source, relativePath)) {
    if (!binding.jsDoc?.includes("@barrits-trait")) {
      continue;
    }

    const metadata = parseTraitDescriptorJsDoc(`/**${binding.jsDoc}*/`);

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
 * [EN] Trims, de-duplicates and sorts a contract string list; undefined or empty input yields an empty list.
 * [ES] Recorta, deduplica y ordena una lista de strings de contrato; una entrada undefined o vacía produce una lista vacía.
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
 * [EN] Converts a manual trait contract from `barrits.config.*` into an inspection descriptor; returns null when
 * the contract lacks a source file, name or binding name.
 * [ES] Convierte un contrato manual de trait de `barrits.config.*` en un descriptor de inspección; devuelve null cuando
 * al contrato le falta archivo fuente, nombre o nombre de binding.
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
    // Empty summary must resolve to undefined (intentional falsy check).
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
 * [EN] Merges discovered (JSDoc) descriptors with manual contract descriptors keyed by `sourceFile::bindingName`;
 * contract fields override discovered ones, and the result is sorted by name then source file.
 * [ES] Fusiona los descriptores descubiertos (JSDoc) con los contratos manuales indexados por
 * `sourceFile::bindingName`; los campos del contrato prevalecen y el resultado se ordena por nombre y archivo.
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
