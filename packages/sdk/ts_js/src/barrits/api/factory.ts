import { DEFAULT_BARRITS_NAMESPACE, resolveBarritsConfig, type BarritsRootConfig, type ResolvedBarritsConfig } from "../config";
import {
  composeTraitDescriptors,
  type AnyTraitDescriptor,
  type ComposedTraitDescriptorsResult,
  type ComposeTraitDescriptorsOptions,
  type MergeTraitProvides,
} from "../traits";
import { barrits } from "./domains";

/**
 * [EN] `composeTraitDescriptors` bound to the resolved configuration: `traitConflictStrategy` from
 * `barrits.config.*` is the default `onConflict`, and per-call options still override it.
 * [ES] `composeTraitDescriptors` ligado a la configuración resuelta: `traitConflictStrategy` de `barrits.config.*`
 * es el `onConflict` por defecto y las opciones de cada llamada siguen prevaleciendo.
 */
export type ConfiguredTraitComposer = <
  TState extends object = Record<string, never>,
  const TDescriptors extends readonly AnyTraitDescriptor[] = readonly AnyTraitDescriptor[],
>(
  descriptors: TDescriptors,
  options?: ComposeTraitDescriptorsOptions<TState>,
) => ComposedTraitDescriptorsResult<TState, MergeTraitProvides<TDescriptors>>;

/**
 * [EN] Dynamically generated application API context matching the requested namespace.
 * [ES] Contexto de API de aplicación generado dinámicamente que coincide con el espacio de nombres solicitado.
 */
export type CustomBarritsApi<TNamespace extends string> = Record<TNamespace, typeof barrits> & {
  /** [EN] Short alias for the API. [ES] Alias corto para la API. */
  brt: typeof barrits;
  /** [EN] Standard name for the API. [ES] Nombre estándar para la API. */
  barrits: typeof barrits;
  /** [EN] Fully resolved configuration object. [ES] Objeto de configuración completamente resuelto. */
  config: ResolvedBarritsConfig;
  /**
   * [EN] Trait composer that honours the configured `traitConflictStrategy`.
   * [ES] Compositor de traits que respeta la `traitConflictStrategy` configurada.
   */
  composeTraits: ConfiguredTraitComposer;
};

/**
 * [EN] Builds a trait composer whose default conflict strategy comes from the resolved configuration.
 * [ES] Construye un compositor de traits cuya estrategia de conflicto por defecto viene de la configuración resuelta.
 *
 * @param config - [EN] Resolved configuration. [ES] Configuración resuelta.
 * @returns [EN] A `composeTraitDescriptors` wrapper. [ES] Un envoltorio de `composeTraitDescriptors`.
 */
export const createConfiguredTraitComposer = (config: Pick<ResolvedBarritsConfig, "traitConflictStrategy">): ConfiguredTraitComposer => {
  return (descriptors, options = {}) => {
    return composeTraitDescriptors(descriptors, { onConflict: config.traitConflictStrategy, ...options });
  };
};

/**
 * [EN] Bootstraps a custom Barrits API domain namespace using the factory pattern.
 * [ES] Arranca un espacio de nombres de dominio de API de Barrits personalizado utilizando el patrón factory.
 *
 * [EN] This enables the codebase to act under a user-defined umbrella variable
 * without losing IDE autocompletion or breaking standard bundler workflows. The namespace is validated while the
 * configuration is resolved: it must be a JavaScript identifier and cannot shadow `brt` or `config`.
 *
 * [ES] Esto permite que la base de código actúe bajo una variable paraguas definida por el usuario
 * sin perder el autocompletado del IDE ni romper los flujos de trabajo estándar del empaquetador. El espacio de
 * nombres se valida al resolver la configuración: debe ser un identificador JavaScript y no puede pisar `brt` ni
 * `config`.
 *
 * @param options - [EN] Explicit configuration overrides to bypass automatic discovery. [ES] Anulaciones de configuración explícitas para omitir el descubrimiento automático.
 * @returns [EN] An API instance featuring the custom configured namespace alongside defaults. [ES] Una instancia de API que presenta el espacio de nombres personalizado configurado junto con los predeterminados.
 */
export const createBarrits = async <TNamespace extends string = "barrits">(
  options?: BarritsRootConfig,
): Promise<CustomBarritsApi<TNamespace>> => {
  const config = await resolveBarritsConfig(options);
  const namespace = (config.namespace ?? DEFAULT_BARRITS_NAMESPACE) as TNamespace;

  return {
    [namespace]: barrits,
    brt: barrits,
    barrits: barrits,
    config,
    composeTraits: createConfiguredTraitComposer(config),
  } as unknown as CustomBarritsApi<TNamespace>;
};
