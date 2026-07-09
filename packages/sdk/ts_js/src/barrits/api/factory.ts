import { resolveBarritsConfig, type BarritsRootConfig, type ResolvedBarritsConfig } from "../config";
import { barrits } from "./domains";

/**
 * [EN] Dynamically generated application API context matching the requested namespace.
 * [ES] Contexto de API de aplicación generado dinámicamente que coincide con el espacio de nombres solicitado.
 */
export type CustomBarritsApi<TNamespace extends string> = {
  [K in TNamespace]: typeof barrits;
} & {
  /** [EN] Short alias for the API. [ES] Alias corto para la API. */
  brt: typeof barrits;
  /** [EN] Standard name for the API. [ES] Nombre estándar para la API. */
  barrits: typeof barrits;
  /** [EN] Fully resolved configuration object. [ES] Objeto de configuración completamente resuelto. */
  config: ResolvedBarritsConfig;
};

/**
 * [EN] Bootstraps a custom Barrits API domain namespace using the factory pattern.
 * [ES] Arranca un espacio de nombres de dominio de API de Barrits personalizado utilizando el patrón factory.
 *
 * [EN] This enables the codebase to act under a user-defined umbrella variable
 * without losing IDE autocompletion or breaking standard bundler workflows.
 *
 * [ES] Esto permite que la base de código actúe bajo una variable paraguas definida por el usuario
 * sin perder el autocompletado del IDE ni romper los flujos de trabajo estándar del empaquetador.
 *
 * @param options - [EN] Explicit configuration overrides to bypass automatic discovery. [ES] Anulaciones de configuración explícitas para omitir el descubrimiento automático.
 * @returns [EN] An API instance featuring the custom configured namespace alongside defaults. [ES] Una instancia de API que presenta el espacio de nombres personalizado configurado junto con los predeterminados.
 */
export const createBarrits = async <TNamespace extends string = "barrits">(
  options?: BarritsRootConfig,
): Promise<CustomBarritsApi<TNamespace>> => {
  const config = await resolveBarritsConfig(options);
  const namespace = (config.namespace ?? "barrits") as TNamespace;

  return {
    [namespace]: barrits,
    brt: barrits,
    barrits: barrits,
    config,
  } as unknown as CustomBarritsApi<TNamespace>;
};
