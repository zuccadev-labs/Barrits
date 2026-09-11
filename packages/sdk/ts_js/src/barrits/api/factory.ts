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
 *
 * [EN] A pre-configured trait composer that bakes in the global conflict strategy,
 * reducing boilerplate when composing traits throughout the application.
 * [ES] Un compositor de traits preconfigurado que incorpora la estrategia de conflictos global,
 * reduciendo el código repetitivo al componer traits en toda la aplicación.
 *
 * @template TState Trait state shape
 * @template TDescriptors Array of trait descriptors to compose
 * @param descriptors Descriptors to compose
 * @param options Composition options (onConflict overrides configured default)
 * @returns Composed trait descriptor with merged provides
 *
 * @example
 * ```typescript
 * const api = await createBarrits({ traitConflictStrategy: "left" });
 * // Calls composer with implicit onConflict: "left"
 * const result = api.composeTraits([dataTrait, cacheTrait]);
 * // Override just this call:
 * const result2 = api.composeTraits([t1, t2], { onConflict: "right" });
 * ```
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
 *
 * [EN] Returned by createBarrits(). Provides namespace-scoped access alongside standard aliases.
 * The namespace can be freely chosen (e.g., "myapp", "platform") without conflict.
 * [ES] Devuelto por createBarrits(). Proporciona acceso con alcance de espacio de nombres junto con alias estándar.
 * El espacio de nombres se puede elegir libremente (p. ej., "myapp", "plataforma") sin conflicto.
 *
 * @template TNamespace Literal namespace name from createBarrits options
 *
 * @example
 * ```typescript
 * type MyApi = CustomBarritsApi<"myapp">;
 * const api: MyApi = await createBarrits({ namespace: "myapp" });
 *
 * // All these reference the same Barrits API:
 * api.myapp.inspect();
 * api.barrits.inspect();
 * api.brt.inspect();
 *
 * // Access config:
 * console.log(api.config.namespace); // "myapp"
 *
 * // Compose traits with configured strategy:
 * api.composeTraits([trait1, trait2]);
 * ```
 */
export type CustomBarritsApi<TNamespace extends string> = Record<TNamespace, typeof barrits> & {
  /** [EN] Short alias for the API. [ES] Alias corto para la API. */
  brt: typeof barrits;
  /** [EN] Standard name for the API. [ES] Nombre estándar para la API. */
  barrits: typeof barrits;
  /** [EN] Fully resolved configuration object (discovery roots, conflict strategy, watch mode). [ES] Objeto de configuración completamente resuelto (raíces de descubrimiento, estrategia de conflictos, modo de vigilancia). */
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
 * [EN] Returns a configured wrapper around `composeTraitDescriptors` that uses the
 * configuration's `traitConflictStrategy` as the default conflict resolver. Per-call options
 * still override this default, allowing fine-grained control.
 * [ES] Devuelve un envoltorio configurado alrededor de `composeTraitDescriptors` que usa la
 * `traitConflictStrategy` de configuración como resolvedor de conflictos predeterminado.
 * Las opciones por llamada siguen prevaleciendo, permitiendo control detallado.
 *
 * @param config Configuration object with traitConflictStrategy ("throw" | "left" | "right")
 * @returns Composer function that respects configured conflict strategy
 * @throws {TypeError} If config.traitConflictStrategy is invalid
 *
 * @example
 * ```typescript
 * const config = await resolveBarritsConfig({ namespace: "myapp" });
 * const composer = createConfiguredTraitComposer(config);
 *
 * // Compose using configured strategy
 * const result = composer([trait1, trait2]);
 *
 * // Override strategy for this call
 * const result = composer([trait1, trait2], { onConflict: "right" });
 * ```
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
 * The returned object provides access to the configured Barrits API, configuration, and a pre-configured
 * trait composer respecting the global conflict strategy.
 *
 * [ES] Esto permite que la base de código actúe bajo una variable paraguas definida por el usuario
 * sin perder el autocompletado del IDE ni romper los flujos de trabajo estándar del empaquetador. El espacio de
 * nombres se valida al resolver la configuración: debe ser un identificador JavaScript y no puede pisar `brt` ni
 * `config`. El objeto devuelto proporciona acceso a la API de Barrits configurada, configuración, y un
 * compositor de traits preconfigurado que respeta la estrategia de conflictos global.
 *
 * @template TNamespace Literal namespace name (e.g., "myapp", "platform", "api")
 * @param options Explicit configuration overrides to bypass automatic discovery (discovery roots, conflict strategy, watch mode)
 * @returns Promise resolving to CustomBarritsApi with namespace, brt alias, config, and composeTraits
 * @throws {Error} If namespace is reserved (cannot use "brt" or "config" as namespace)
 * @throws {Error} If namespace is not a valid JavaScript identifier
 * @throws {Error} If barrits.config.ts cannot be loaded
 *
 * @example
 * ```typescript
 * // Default namespace "barrits"
 * const api1 = await createBarrits();
 * const composed = api1.composeTraits([trait1, trait2]);
 *
 * // Custom namespace "myapp"
 * const api2 = await createBarrits({ namespace: "myapp" });
 * const composed2 = api2.myapp.inspect();
 *
 * // Override configuration
 * const api3 = await createBarrits({
 *   namespace: "platform",
 *   discoveryRoots: ["./services"],
 *   traitConflictStrategy: "right"
 * });
 * ```
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
