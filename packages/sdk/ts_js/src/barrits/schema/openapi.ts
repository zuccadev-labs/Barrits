/**
 * @module
 * [EN] OpenAPI 3.1 generation: per route for composed backends (`generateOpenApiFromRoutes`), or one
 * endpoint per trait from `http:method=`/`http:path=` tags in a build manifest (`generateOpenApiSchema`).
 * [ES] Generación OpenAPI 3.1: por rutas (`generateOpenApiFromRoutes`) o un endpoint por trait desde
 * las etiquetas `http:*` de un manifiesto (`generateOpenApiSchema`).
 *
 * [EN] A trait exposes HTTP routes as a capability whose key contains "routes" (`crud-routes`,
 * `user_routes`, `routes`…): an array of {@link BarritsRouteContract}. The server mounts that
 * list and this module documents the same list, so the spec cannot drift from what is served.
 * Routes are read after composition, because traits usually build them inside `create()`, where
 * static (AST) discovery cannot see them. `generateOpenApiSchema` (one endpoint per trait, from
 * `http:method=`/`http:path=` tags) remains for single-endpoint traits.
 * [ES] Un trait expone sus rutas HTTP en una capacidad cuya clave contiene "routes". El servidor
 * monta esa lista y este módulo documenta la misma, así que la spec no puede separarse de lo servido.
 *
 * @example
 * ```ts
 * import { composeTraitDescriptors } from "@zuccadev-labs/barrits";
 * import { generateOpenApiFromRoutes } from "@zuccadev-labs/barrits/schema/openapi";
 *
 * const { traits } = composeTraitDescriptors([usersTrait, healthTrait]);
 * const spec = generateOpenApiFromRoutes(traits, {
 *   title: "My API",
 *   version: "1.0.0",
 *   securitySchemes: { bearer: { type: "http", scheme: "bearer" } },
 *   securityFor: (route) => (route.access === "public" ? [] : [{ bearer: [] }]),
 * });
 * ```
 */
import type { BarritsBuildManifest, BarritsTraitDescriptorInspection } from "../sdk/contracts";

/**
 * [EN] OpenAPI v3.1 document with Barrits trait-driven schema generation support.
 * [ES] Documento OpenAPI v3.1 con soporte para generación de esquemas impulsada por traits de Barrits.
 *
 * [EN] Represents a valid OpenAPI v3.1 document with paths derived from trait HTTP tags.
 * Immutable (readonly) to ensure contract stability in generation pipelines.
 * [ES] Representa un documento OpenAPI v3.1 válido con rutas derivadas de etiquetas HTTP de traits.
 * Inmutable (readonly) para garantizar la estabilidad del contrato en tuberías de generación.
 *
 * @example
 * ```typescript
 * const doc: BarritsOpenApiDocument = {
 *   openapi: "3.1.0",
 *   info: { title: "My API", version: "1.0.0" },
 *   paths: {
 *     "/api/users": {
 *       get: { operationId: "listUsers", responses: { "200": { description: "OK" } } }
 *     }
 *   },
 *   components: { schemas: {} }
 * };
 * ```
 *
 * @experimental This API is experimental and subject to change.
 */
export type BarritsOpenApiDocument = {
  /** [EN] OpenAPI version (always "3.1.0"). [ES] Versión OpenAPI (siempre "3.1.0"). */
  readonly openapi: "3.1.0";
  /** [EN] API metadata (title, version, description). [ES] Metadatos de la API (título, versión, descripción). */
  readonly info: {
    /** [EN] Human-readable API title. [ES] Título legible de la API. */
    readonly title: string;
    /** [EN] Semantic version of API. [ES] Versión semántica de la API. */
    readonly version: string;
    /** [EN] Optional description. [ES] Descripción opcional. */
    readonly description?: string;
    /** [EN] Experimental flag. [ES] Bandera experimental. */
    readonly "x-experimental"?: boolean;
  };
  /** [EN] API paths and operations (endpoints). [ES] Rutas de API y operaciones (endpoints). */
  readonly paths: Record<string, Record<string, unknown>>;
  /** [EN] Reusable components (schemas, responses, etc.). [ES] Componentes reutilizables (esquemas, respuestas, etc.). */
  readonly components: {
    /** [EN] JSON Schema definitions for data models. [ES] Definiciones de esquema JSON para modelos de datos. */
    readonly schemas: Record<string, unknown>;
  };
};

/**
 * [EN] Options for OpenAPI schema generation.
 * [ES] Opciones para la generación del esquema OpenAPI.
 *
 * [EN] Configures title, version, description, and experimental flag for generated schema.
 * All fields are optional with sensible defaults.
 * [ES] Configura título, versión, descripción y bandera experimental para el esquema generado.
 * Todos los campos son opcionales con valores predeterminados sensatos.
 *
 * @example
 * ```typescript
 * const opts: BarritsOpenApiOptions = {
 *   title: "Comprehensive Example API",
 *   version: "1.0.0",
 *   description: "Multi-layer trait architecture demonstration",
 *   experimental: false
 * };
 * ```
 */
export type BarritsOpenApiOptions = {
  /** [EN] API Title (default: "Barrits Managed API"). [ES] Título de la API (predeterminado: "Barrits Managed API"). */
  title?: string;
  /** [EN] API Version (default: "1.0.0"). [ES] Versión de la API (predeterminado: "1.0.0"). */
  version?: string;
  /** [EN] API Description. [ES] Descripción de la API. */
  description?: string;
  /** [EN] Mark as experimental (default: true). [ES] Marcar como experimental (predeterminado: true). */
  experimental?: boolean;
};

const parseTag = (tag: string): { key: string; value: string } | null => {
  const match = /^([^=]+)=([^=]+)$/.exec(tag);
  return match ? { key: match[1], value: match[2] } : null;
};

const getTraitTag = (descriptor: BarritsTraitDescriptorInspection, tagKey: string): string | undefined => {
  for (const tag of descriptor.tags) {
    const parsed = parseTag(tag);
    if (parsed?.key === tagKey) {
      return parsed.value;
    }
  }
  return undefined;
};

/**
 * [EN] Generates an OpenAPI v3.1 schema from a BarritsBuildManifest, reading trait tags for
 * endpoints (`http:method=GET|POST|...` and `http:path=/api/...`).
 * [ES] Genera un esquema OpenAPI v3.1 desde un BarritsBuildManifest, leyendo tags de traits
 * para puntos de entrada (`http:method=GET|POST|...` y `http:path=/api/...`).
 *
 * [EN] Scans all trait descriptors in the manifest for HTTP-related tags.
 * Traits tagged with `http:method=` and `http:path=` are added as OpenAPI operations.
 * Fallback: traits with `http-endpoint` tag get auto-path generation.
 * [ES] Escanea todos los descriptores de traits en el manifiesto para etiquetas relacionadas con HTTP.
 * Los traits etiquetados con `http:method=` y `http:path=` se añaden como operaciones OpenAPI.
 * Fallback: los traits con etiqueta `http-endpoint` obtienen generación de ruta automática.
 *
 * @param manifest [EN] The discovery manifest containing trait descriptors. [ES] El manifiesto de descubrimiento con descriptores de traits.
 * @param options [EN] Generation options (title, version, description, experimental flag). [ES] Opciones de generación (título, versión, descripción, bandera experimental).
 * @returns [EN] OpenAPI v3.1 document with paths and schemas. [ES] Documento OpenAPI v3.1 con rutas y esquemas.
 * @throws {TypeError} If manifest.traitDescriptors is missing or invalid
 *
 * @example
 * ```typescript
 * const manifest = {
 *   version: "0.3.0",
 *   traitDescriptors: [
 *     {
 *       name: "getUserEndpoint",
 *       tags: ["http:method=GET", "http:path=/api/users/{id}"]
 *     }
 *   ]
 * };
 *
 * const schema = generateOpenApiSchema(manifest, {
 *   title: "My API",
 *   version: "1.0.0"
 * });
 *
 * // schema.paths["/api/users/{id}"].get = { operationId: "getUserEndpoint", ... }
 * ```
 *
 * @experimental This API is experimental and subject to change.
 */
export const generateOpenApiSchema = (manifest: BarritsBuildManifest, options: BarritsOpenApiOptions = {}): BarritsOpenApiDocument => {
  const openapi: BarritsOpenApiDocument = {
    openapi: "3.1.0",
    info: {
      title: options.title ?? "Barrits Managed API",
      version: options.version ?? "1.0.0",
      description: options.description ?? "Automatically generated by Barrits AST Discovery.",
      "x-experimental": options.experimental ?? true,
    },
    paths: {},
    components: {
      schemas: {},
    },
  };

  for (const descriptor of manifest.traitDescriptors) {
    const httpMethod = getTraitTag(descriptor, "http:method");
    const httpPath = getTraitTag(descriptor, "http:path");

    if (httpMethod && httpPath) {
      const pathKey = httpPath;
      if (!openapi.paths[pathKey]) {
        openapi.paths[pathKey] = {};
      }

      const methodLower = httpMethod.toLowerCase();
      openapi.paths[pathKey][methodLower] = {
        summary: descriptor.summary ?? `Executes ${descriptor.name}`,
        operationId: descriptor.name,
        tags:
          descriptor.tags.filter((tag) => !tag.includes("=")).length > 0 ? descriptor.tags.filter((tag) => !tag.includes("=")) : undefined,
        responses: {
          "200": {
            description: "Successful response",
          },
        },
      };
      continue;
    }

    if (descriptor.tags.includes("http-endpoint") || descriptor.name.toLowerCase().includes("endpoint")) {
      const path = `/${descriptor.name.toLowerCase().replace(/endpoint$/, "")}`;
      openapi.paths[path] = {
        post: {
          summary: descriptor.summary ?? `Executes ${descriptor.name}`,
          operationId: descriptor.name,
          responses: {
            "200": {
              description: "Successful response",
            },
          },
        },
      };
    }
  }

  return openapi;
};

// ─── Route-level generation (since 0.3.1) ───────────────────────────────────────
// Kept in this module (no relative runtime import), so Deno can import the source directly.

/** [EN] HTTP methods OpenAPI can describe. [ES] Métodos HTTP que OpenAPI puede describir. */
export type BarritsHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";

/** [EN] OpenAPI security requirement: scheme name → scopes. [ES] Requisito de seguridad OpenAPI. */
export type BarritsSecurityRequirement = Readonly<Record<string, readonly string[]>>;

/** [EN] OpenAPI parameter object. [ES] Objeto parámetro de OpenAPI. */
export type BarritsOpenApiParameter = {
  readonly name: string;
  readonly in: "path" | "query" | "header" | "cookie";
  readonly description?: string;
  readonly required?: boolean;
  readonly schema?: Readonly<Record<string, unknown>>;
  readonly example?: unknown;
};

/**
 * [EN] Per-route OpenAPI metadata. Every field overrides what the generator would derive.
 * [ES] Metadatos OpenAPI por ruta; cada campo sustituye lo que derivaría el generador.
 */
export type BarritsRouteOpenApiMeta = {
  readonly summary?: string;
  readonly description?: string;
  readonly operationId?: string;
  /** [EN] Single tag (shorthand for `tags: [tag]`). [ES] Etiqueta única. */
  readonly tag?: string;
  readonly tags?: readonly string[];
  readonly parameters?: readonly BarritsOpenApiParameter[];
  readonly requestBody?: Readonly<Record<string, unknown>>;
  readonly responses?: Readonly<Record<string, unknown>>;
  readonly security?: readonly BarritsSecurityRequirement[];
  readonly deprecated?: boolean;
};

/**
 * [EN] A route as a trait declares it. `path` uses `:param` or `{param}`. Other fields (handler,
 * access, scope…) are the server's business; the generator passes the route to `securityFor`.
 * [ES] Una ruta tal como la declara un trait. Los demás campos son del servidor.
 */
export type BarritsRouteContract = {
  readonly method: string;
  readonly path: string;
  readonly access?: string;
  readonly scope?: string;
  readonly _openapi?: BarritsRouteOpenApiMeta;
  readonly [key: string]: unknown;
};

/** [EN] A route with the capability that exposed it. [ES] Una ruta con la capacidad que la expuso. */
export type BarritsCollectedRoute = {
  readonly capability: string;
  readonly route: BarritsRouteContract;
};

/** [EN] Options for {@link generateOpenApiFromRoutes}. [ES] Opciones de {@link generateOpenApiFromRoutes}. */
export type BarritsRoutesOpenApiOptions = {
  readonly title?: string;
  readonly version?: string;
  readonly description?: string;
  readonly servers?: readonly { readonly url: string; readonly description?: string }[];
  /** [EN] `components.securitySchemes`. [ES] `components.securitySchemes`. */
  readonly securitySchemes?: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  /** [EN] `components.schemas`. [ES] `components.schemas`. */
  readonly schemas?: Readonly<Record<string, unknown>>;
  /**
   * [EN] Security of a route without `_openapi.security`. Default: none (the operation omits it).
   * [ES] Seguridad de una ruta sin `_openapi.security`. Por defecto, ninguna.
   */
  readonly securityFor?: (route: BarritsRouteContract) => readonly BarritsSecurityRequirement[] | undefined;
  /** [EN] Default tag of a capability. Default: its name without "routes", in Title Case. [ES] Etiqueta por defecto. */
  readonly tagFor?: (capability: string) => string;
  readonly tagDescriptions?: Readonly<Record<string, string>>;
  /** [EN] Routes outside the traits (health checks…), under capability "core". [ES] Rutas fuera de los traits. */
  readonly extraRoutes?: readonly BarritsRouteContract[];
  /**
   * [EN] Two routes with the same method and path: "error" (default) throws, "first" keeps the
   * first one (what a first-match router serves), "last" keeps the last one.
   * [ES] Dos rutas con el mismo método y ruta: "error" (por defecto) lanza, "first" o "last".
   */
  readonly onDuplicate?: "error" | "first" | "last";
  /** [EN] Extra top-level fields (`x-…`). [ES] Campos de primer nivel adicionales (`x-…`). */
  readonly extensions?: Readonly<Record<`x-${string}`, unknown>>;
};

/** [EN] OpenAPI operation produced for a route. [ES] Operación OpenAPI generada para una ruta. */
export type BarritsRouteOperation = {
  readonly operationId: string;
  readonly summary?: string;
  readonly description?: string;
  readonly tags: readonly string[];
  readonly parameters?: readonly BarritsOpenApiParameter[];
  readonly requestBody?: Readonly<Record<string, unknown>>;
  readonly responses: Readonly<Record<string, unknown>>;
  readonly security?: readonly BarritsSecurityRequirement[];
  readonly deprecated?: boolean;
};

/** [EN] OpenAPI 3.1 document produced from routes. [ES] Documento OpenAPI 3.1 generado desde rutas. */
export type BarritsRoutesOpenApiDocument = {
  readonly openapi: "3.1.0";
  readonly info: { readonly title: string; readonly version: string; readonly description?: string };
  readonly servers?: readonly { readonly url: string; readonly description?: string }[];
  readonly tags: readonly { readonly name: string; readonly description?: string }[];
  readonly paths: Readonly<Record<string, Readonly<Record<string, BarritsRouteOperation>>>>;
  readonly components: {
    readonly schemas: Readonly<Record<string, unknown>>;
    readonly securitySchemes: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  };
  readonly [extension: `x-${string}`]: unknown;
};

const HTTP_METHODS: ReadonlySet<string> = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE"]);

/** [EN] Whether a capability key holds routes. [ES] Si una clave de capacidad contiene rutas. */
export const isRoutesCapability = (key: string): boolean => key.toLowerCase().includes("routes");

const isRoute = (value: unknown): value is BarritsRouteContract =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as { method?: unknown }).method === "string" &&
  typeof (value as { path?: unknown }).path === "string";

/**
 * [EN] Every route exposed by composed capabilities, in declaration order. Use the same list to
 * mount routes and to document them.
 * [ES] Todas las rutas expuestas por las capacidades compuestas, en orden de declaración.
 *
 * @param capabilities - [EN] Composed capabilities (e.g. `composeTraitDescriptors(...).traits`). [ES] Capacidades compuestas.
 * @returns [EN] Routes with their capability. [ES] Rutas con su capacidad.
 */
export const collectRoutes = (capabilities: Readonly<Record<string, unknown>>): BarritsCollectedRoute[] => {
  const out: BarritsCollectedRoute[] = [];
  for (const [capability, value] of Object.entries(capabilities)) {
    if (!isRoutesCapability(capability) || !Array.isArray(value)) {
      continue;
    }
    for (const route of value as unknown[]) {
      if (isRoute(route)) {
        out.push({ capability, route });
      }
    }
  }
  return out;
};

/** [EN] `/users/:id` → `/users/{id}`. [ES] `/users/:id` → `/users/{id}`. */
export const toOpenApiPath = (path: string): string => path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");

const pathParameters = (openApiPath: string): BarritsOpenApiParameter[] =>
  [...openApiPath.matchAll(/\{([^}]+)\}/g)].map((m) => ({ name: m[1], in: "path", required: true, schema: { type: "string" } }));

const defaultTag = (capability: string): string => {
  const base = capability
    .replace(/[-_]?routes$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!base) {
    return "Core";
  }
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
};

const defaultResponses = (method: string): Record<string, unknown> => {
  const errors = { "4XX": { description: "Client error" }, "5XX": { description: "Server error" } };
  if (method === "post") {
    return { "201": { description: "Created" }, "200": { description: "OK" }, ...errors };
  }
  if (method === "delete") {
    return { "200": { description: "Deleted" }, "204": { description: "No Content" }, ...errors };
  }
  return { "200": { description: "OK" }, ...errors };
};

const operationIdFor = (method: string, openApiPath: string): string =>
  method +
  openApiPath
    .replace(/\{([^}]+)\}/g, "By_$1")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/_+$/g, "");

/**
 * [EN] Generates an OpenAPI 3.1 document from the routes of composed capabilities.
 * Deterministic (paths and tags sorted), pure (no I/O, no `typescript`), and fail-closed on
 * conflicts: a duplicated method+path or operationId throws unless `onDuplicate` says otherwise.
 * Routes with a method OpenAPI cannot express (e.g. `*`) are skipped.
 * [ES] Genera un documento OpenAPI 3.1 desde las rutas de las capacidades compuestas. Determinista,
 * puro y cerrado ante conflictos: un método+ruta u operationId duplicado lanza un error.
 *
 * @param source - [EN] Composed capabilities, or routes from {@link collectRoutes}. [ES] Capacidades compuestas o rutas recogidas.
 * @param options - [EN] Document options. [ES] Opciones del documento.
 * @returns [EN] The OpenAPI document. [ES] El documento OpenAPI.
 * @throws {Error} [EN] On duplicated routes or operationIds. [ES] Si hay rutas u operationIds duplicados.
 */
export const generateOpenApiFromRoutes = (
  source: Readonly<Record<string, unknown>> | readonly BarritsCollectedRoute[],
  options: BarritsRoutesOpenApiOptions = {},
): BarritsRoutesOpenApiDocument => {
  const collected: BarritsCollectedRoute[] = Array.isArray(source)
    ? [...(source as readonly BarritsCollectedRoute[])]
    : collectRoutes(source as Readonly<Record<string, unknown>>);
  for (const route of options.extraRoutes ?? []) {
    collected.push({ capability: "core", route });
  }

  const onDuplicate = options.onDuplicate ?? "error";
  const tagFor = options.tagFor ?? defaultTag;
  const paths: Record<string, Record<string, BarritsRouteOperation>> = {};
  const operationIds = new Map<string, string>();
  const tagNames = new Set<string>();

  for (const { capability, route } of collected) {
    const upper = route.method.toUpperCase();
    if (!HTTP_METHODS.has(upper)) {
      continue;
    }
    const method = upper.toLowerCase();
    const openApiPath = toOpenApiPath(route.path);
    const where = `${upper} ${openApiPath}`;
    const item = (paths[openApiPath] ??= {});
    if (item[method]) {
      if (onDuplicate === "error") {
        throw new Error(`[Barrits OpenAPI] Duplicated route ${where} (capability "${capability}").`);
      }
      if (onDuplicate === "first") {
        continue;
      }
      operationIds.delete(item[method].operationId);
    }

    const meta = route._openapi ?? {};
    const tags = meta.tags ?? [meta.tag ?? tagFor(capability)];
    const params = new Map<string, BarritsOpenApiParameter>();
    for (const p of pathParameters(openApiPath)) params.set(`${p.in}:${p.name}`, p);
    for (const p of meta.parameters ?? []) params.set(`${p.in}:${p.name}`, p);
    const operationId = meta.operationId ?? operationIdFor(method, openApiPath);
    const previous = operationIds.get(operationId);
    if (previous !== undefined) {
      throw new Error(`[Barrits OpenAPI] operationId "${operationId}" is used by ${previous} and ${where}.`);
    }
    operationIds.set(operationId, where);

    const security = meta.security ?? options.securityFor?.(route);
    item[method] = {
      operationId,
      ...(meta.summary ? { summary: meta.summary } : {}),
      ...(meta.description ? { description: meta.description } : {}),
      tags,
      ...(params.size > 0 ? { parameters: [...params.values()] } : {}),
      ...(meta.requestBody ? { requestBody: meta.requestBody } : {}),
      responses: meta.responses ?? defaultResponses(method),
      ...(security ? { security } : {}),
      ...(meta.deprecated ? { deprecated: true } : {}),
    };
    for (const t of tags) tagNames.add(t);
  }

  const sortedPaths: Record<string, Record<string, BarritsRouteOperation>> = {};
  for (const p of Object.keys(paths).sort()) {
    if (Object.keys(paths[p]).length > 0) {
      sortedPaths[p] = paths[p];
    }
  }

  return {
    openapi: "3.1.0",
    info: {
      title: options.title ?? "Barrits Managed API",
      version: options.version ?? "1.0.0",
      ...(options.description ? { description: options.description } : {}),
    },
    ...(options.servers?.length ? { servers: options.servers } : {}),
    tags: [...tagNames].sort().map((name) => ({
      name,
      ...(options.tagDescriptions?.[name] ? { description: options.tagDescriptions[name] } : {}),
    })),
    paths: sortedPaths,
    components: {
      schemas: options.schemas ?? {},
      securitySchemes: options.securitySchemes ?? {},
    },
    ...(options.extensions ?? {}),
  };
};
