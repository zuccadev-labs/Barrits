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
