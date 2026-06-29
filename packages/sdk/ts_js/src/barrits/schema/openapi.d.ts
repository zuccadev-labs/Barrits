import type { BarritsBuildManifest } from "../sdk/contracts";
/**
 * [EN] Options for OpenAPI schema generation.
 * [ES] Opciones para la generación del esquema OpenAPI.
 */
export type BarritsOpenApiOptions = {
    /** [EN] API Title. [ES] Título de la API. */
    title?: string;
    /** [EN] API Version. [ES] Versión de la API. */
    version?: string;
    /** [EN] API Description. [ES] Descripción de la API. */
    description?: string;
};
/**
 * [EN] Generates an OpenAPI v3.1 schema from a BarritsBuildManifest.
 * [ES] Genera un esquema OpenAPI v3.1 desde un BarritsBuildManifest.
 *
 * @param manifest [EN] The discovery manifest. [ES] El manifiesto de descubrimiento.
 * @param options [EN] Generation options. [ES] Opciones de generación.
 */
export declare const generateOpenApiSchema: (manifest: BarritsBuildManifest, options?: BarritsOpenApiOptions) => Record<string, any>;
