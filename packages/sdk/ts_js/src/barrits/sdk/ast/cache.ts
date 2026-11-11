import type * as TypeScript from "typescript";

/**
 * [EN] Shape of the TypeScript compiler API module used by the AST layer.
 * [ES] Forma del módulo de la API del compilador de TypeScript usada por la capa AST.
 */
export type TypeScriptModule = typeof TypeScript;

const AST_CACHE = new Map<
  string,
  {
    readonly source: string;
    readonly sourceFile: TypeScript.SourceFile;
  }
>();

const MAX_AST_CACHE_ENTRIES = 2048;

let typescriptModule: TypeScriptModule | undefined;
let typescriptLoading: Promise<TypeScriptModule> | undefined;

const describeError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

/**
 * [EN] Loads the `typescript` peer dependency lazily and caches it for the synchronous AST helpers.
 * Keeping the import lazy means every Barrits entrypoint can be imported on any runtime without resolving
 * `typescript`; only source inspection pays for it, and a missing dependency yields an actionable error.
 * [ES] Carga la dependencia peer `typescript` de forma perezosa y la cachea para los helpers AST síncronos.
 * Mantener el import perezoso permite importar cualquier entrypoint de Barrits en cualquier runtime sin resolver
 * `typescript`; solo la inspección de fuentes lo paga, y una dependencia ausente produce un error accionable.
 *
 * @returns [EN] The TypeScript compiler API. [ES] La API del compilador de TypeScript.
 * @throws Error - [EN] When the peer dependency cannot be resolved. [ES] Cuando la dependencia peer no puede resolverse.
 */
/**
 * [EN] Microsoft's package that re-exports the TypeScript 6 compiler API next to TypeScript 7, whose
 * native compiler has no stable JavaScript API (no `createSourceFile`) yet.
 * [ES] Paquete de Microsoft que reexporta la API de TypeScript 6 junto a TypeScript 7.
 */
export const TYPESCRIPT6_COMPAT_PACKAGE = "@typescript/typescript6";

const hasClassicCompilerApi = (candidate: unknown): candidate is TypeScriptModule =>
  typeof (candidate as { createSourceFile?: unknown } | null)?.createSourceFile === "function" &&
  typeof (candidate as { transpileModule?: unknown } | null)?.transpileModule === "function";

const unwrapDefault = (imported: unknown): unknown => (imported as { default?: unknown } | null)?.default ?? imported;

/**
 * [EN] Returns the classic compiler API from `imported` (the "typescript" module), or from
 * `@typescript/typescript6` when "typescript" is TypeScript 7+. Throws an actionable error otherwise.
 * [ES] Devuelve la API clásica del compilador desde "typescript" o, si es TypeScript 7+, desde
 * `@typescript/typescript6`; si no, lanza un error accionable.
 *
 * @param imported - [EN] The loaded "typescript" module. [ES] El módulo "typescript" cargado.
 * @param importer - [EN] Imports a module by specifier. [ES] Importa un módulo por especificador.
 * @returns [EN] The classic compiler API. [ES] La API clásica del compilador.
 */
export const pickClassicTypeScript = async (
  imported: unknown,
  importer: (specifier: string) => Promise<unknown>,
): Promise<TypeScriptModule> => {
  const primary = unwrapDefault(imported);
  if (hasClassicCompilerApi(primary)) {
    return primary;
  }
  const compat = await importer(TYPESCRIPT6_COMPAT_PACKAGE).then(unwrapDefault, () => undefined);
  if (hasClassicCompilerApi(compat)) {
    return compat;
  }
  const version = (primary as { version?: unknown } | null)?.version;
  throw new Error(
    `Barrits needs the TypeScript 5/6 compiler API, but the installed "typescript"${typeof version === "string" ? ` (${version})` : ""} does not expose it (TypeScript 7 has no stable JavaScript API yet). Install "typescript@^6" or add "${TYPESCRIPT6_COMPAT_PACKAGE}" next to TypeScript 7.`,
  );
};

// A variable specifier keeps bundlers from trying to resolve the optional compat package.
const importOptional = (specifier: string): Promise<unknown> => import(specifier);

export const loadTypeScript = async (): Promise<TypeScriptModule> => {
  if (typescriptModule) {
    return typescriptModule;
  }

  typescriptLoading ??= (import("typescript") as Promise<unknown>)
    .catch((error: unknown) => {
      throw new Error(
        `Barrits AST inspection requires the "typescript" peer dependency. Install it with your package manager (or "deno add npm:typescript"). Cause: ${describeError(error)}`,
        { cause: error },
      );
    })
    .then((imported) => pickClassicTypeScript(imported, importOptional))
    .then((api) => {
      typescriptModule = api;
      return api;
    })
    .catch((error: unknown) => {
      typescriptLoading = undefined;
      throw error;
    });

  return typescriptLoading;
};

/**
 * [EN] Returns the already loaded TypeScript compiler API for synchronous helpers.
 * [ES] Devuelve la API del compilador de TypeScript ya cargada para los helpers síncronos.
 *
 * @throws Error - [EN] When `loadTypeScript()` has not completed yet. [ES] Cuando `loadTypeScript()` aún no ha terminado.
 */
export const requireTypeScript = (): TypeScriptModule => {
  if (!typescriptModule) {
    throw new Error(
      "TypeScript compiler API is not loaded yet. Await loadTypeScript() (inspectBarritsIntegrations, inspectLayer and extractExports do it automatically) before calling synchronous AST helpers.",
    );
  }

  return typescriptModule;
};

/**
 * [EN] Whether the TypeScript compiler API has been loaded in this process.
 * [ES] Indica si la API del compilador de TypeScript ya se cargó en este proceso.
 */
export const isTypeScriptLoaded = (): boolean => {
  return typescriptModule !== undefined;
};

/**
 * [EN] Retrieves a cached AST source file for a path and source text. A cache hit requires the exact same source;
 * otherwise the file is re-parsed and the entry replaced.
 * [ES] Recupera un SourceFile AST cacheado para una ruta y un texto fuente. Un acierto de caché exige exactamente el
 * mismo fuente; en caso contrario el archivo se vuelve a parsear y la entrada se reemplaza.
 *
 * @param relativePath - [EN] Portable relative path of the file. [ES] Ruta relativa portable del archivo.
 * @param source - [EN] Current source text. [ES] Texto fuente actual.
 * @returns [EN] The parsed SourceFile. [ES] El SourceFile parseado.
 */
export const createCachedSourceFile = (relativePath: string, source: string): TypeScript.SourceFile => {
  const cached = AST_CACHE.get(relativePath);

  if (cached?.source === source) {
    return cached.sourceFile;
  }

  const ts = requireTypeScript();
  const sourceFile = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);

  if (!AST_CACHE.has(relativePath) && AST_CACHE.size >= MAX_AST_CACHE_ENTRIES) {
    const oldestPath = AST_CACHE.keys().next().value;

    if (oldestPath !== undefined) {
      AST_CACHE.delete(oldestPath);
    }
  }

  AST_CACHE.set(relativePath, { source, sourceFile });
  return sourceFile;
};

/**
 * [EN] Purges the AST cache. Use it after each inspection cycle in long-running watch sessions to bound memory.
 * [ES] Vacía la caché AST. Úsala tras cada ciclo de inspección en sesiones watch de larga duración para acotar memoria.
 */
export const clearAstCache = (): void => {
  AST_CACHE.clear();
};
