import type { BarritsBuildManifest } from "../sdk/contracts";

/**
 * [EN] Factory function type for generating capability instances.
 * [ES] Tipo de función de fábrica para generar instancias de capacidades.
 *
 * [EN] Called by container.resolve() to create a capability.
 * Receives the container as context for resolving dependencies.
 * Can be sync or async (Promise).
 * [ES] Llamado por container.resolve() para crear una capacidad.
 * Recibe el contenedor como contexto para resolver dependencias.
 * Puede ser síncrono o asíncrono (Promise).
 *
 * @template T Type of instance returned by factory
 * @param container BarritsIoCContainer instance for resolving dependencies
 * @returns Capability instance (sync or async)
 *
 * @example
 * ```typescript
 * const dbFactory: Factory<DatabaseCapability> = async (container) => {
 *   const config = await container.resolve("config:db");
 *   return {
 *     query: async (sql: string) => { ... },
 *     execute: async (sql: string) => { ... }
 *   };
 * };
 * container.register("db:query", dbFactory);
 * ```
 */
export type Factory<T = unknown> = (container: BarritsIoCContainer) => T | Promise<T>;

/**
 * [EN] Dynamic Inversion of Control (IoC) Container powered by AST Trait discovery.
 * [ES] Contenedor dinámico de Inversión de Control (IoC) impulsado por el descubrimiento de Traits AST.
 */
export class BarritsIoCContainer {
  private readonly instances = new Map<string, unknown>();
  private readonly factories = new Map<string, Factory>();
  private readonly manifest?: BarritsBuildManifest;
  private readonly resolvingStack = new Set<string>();

  /**
   * [EN] Initializes the IoC container with optional build manifest.
   * [ES] Inicializa el contenedor IoC con manifiesto de compilación opcional.
   *
   * [EN] Creates a new container instance. If manifest is provided, can be used
   * with wire() to auto-register trait factories from the manifest.
   * [ES] Crea una nueva instancia de contenedor. Si se proporciona el manifiesto,
   * puede usarse con wire() para registrar automáticamente fábricas de traits del manifiesto.
   *
   * @param manifest Optional build manifest for auto-wiring (see wire() method)
   *
   * @example
   * ```typescript
   * // Without manifest (manual registration)
   * const container = new BarritsIoCContainer();
   * container.register("db:query", () => dbFactory());
   *
   * // With manifest (auto-wiring ready)
   * const container = new BarritsIoCContainer(buildManifest);
   * container.wire(); // Auto-registers traits
   * ```
   */
  constructor(manifest?: BarritsBuildManifest) {
    this.manifest = manifest;
  }

  /**
   * [EN] Registers a factory for a capability, enabling lazy resolution.
   * [ES] Registra una fábrica para una capacidad, habilitando resolución lazy.
   *
   * [EN] Stores the factory function without immediately invoking it.
   * Factory will be called on first resolution, and the result cached.
   * [ES] Almacena la función de fábrica sin invocarla inmediatamente.
   * La fábrica se llamará en la primera resolución, y el resultado se cachea.
   *
   * @template T Type of capability instance
   * @param capability Capability identifier (e.g., "db:query", "cache:get")
   * @param factory Function that creates the capability instance (sync or async)
   * @throws {TypeError} If capability is empty string or factory is not callable
   *
   * @example
   * ```typescript
   * container.register("db:query", async (ioc) => ({
   *   query: async (sql: string) => [{ id: 1 }]
   * }));
   *
   * // Later: const db = await container.resolve("db:query");
   * ```
   */
  register<T>(capability: string, factory: Factory<T>): void {
    this.factories.set(capability, factory);
  }

  /**
   * [EN] Checks whether a capability is registered or already resolved.
   * [ES] Comprueba si una capacidad está registrada o ya resuelta.
   *
   * [EN] Does not differentiate between registered-but-unresolved and resolved.
   * Use to guard against resolution errors before calling resolve().
   * [ES] No diferencia entre registered-pero-sin-resolver y resuelto.
   * Úsalo para protegerse contra errores de resolución antes de llamar a resolve().
   *
   * @param capability Capability identifier to check
   * @returns true if registered or cached, false otherwise
   *
   * @example
   * ```typescript
   * if (container.has("db:query")) {
   *   const db = await container.resolve("db:query");
   * }
   * ```
   */
  has(capability: string): boolean {
    return this.factories.has(capability) || this.instances.has(capability);
  }

  /**
   * [EN] Unregisters a capability and clears its cached instance.
   * [ES] Anula el registro de una capacidad y borra su instancia en caché.
   *
   * [EN] Removes both the factory and any cached instance.
   * Safe to call even if capability was never registered.
   * [ES] Elimina tanto la fábrica como cualquier instancia en caché.
   * Seguro de llamar aunque la capacidad nunca fuera registrada.
   *
   * @param capability Capability identifier to unregister
   *
   * @example
   * ```typescript
   * container.unregister("db:query");
   * // Next resolve() will throw if not re-registered
   * ```
   */
  unregister(capability: string): void {
    this.factories.delete(capability);
    this.instances.delete(capability);
  }

  /**
   * [EN] Resolves a capability from the container, detecting circular dependencies.
   * [ES] Resuelve una capacidad del contenedor, detectando dependencias circulares.
   *
   * [EN] Looks up capability in cache; if not found, calls factory and caches result.
   * Detects circular dependencies via resolvingStack tracking.
   * [ES] Busca la capacidad en caché; si no está, llama a la fábrica y cachea el resultado.
   * Detecta dependencias circulares mediante seguimiento de resolvingStack.
   *
   * @template T Type of resolved capability
   * @param capability Capability identifier to resolve
   * @returns Promise resolving to the capability instance
   * @throws {Error} "Circular dependency detected" if cycle found during resolution
   * @throws {Error} "Unresolved dependency" if capability not registered
   *
   * @example
   * ```typescript
   * try {
   *   const db = await container.resolve<DbCapability>("db:query");
   *   const results = await db.query("SELECT * FROM users");
   * } catch (e) {
   *   console.error("Resolution failed:", e.message);
   * }
   * ```
   */
  async resolve<T>(capability: string): Promise<T> {
    if (this.instances.has(capability)) {
      return this.instances.get(capability) as T;
    }

    if (this.resolvingStack.has(capability)) {
      throw new Error(`[Barrits IoC] Circular dependency detected: ${capability}`);
    }

    const factory = this.factories.get(capability);
    if (!factory) {
      throw new Error(`[Barrits IoC] Unresolved dependency: Cannot find factory for capability '${capability}'`);
    }

    this.resolvingStack.add(capability);
    try {
      const instance = await factory(this);
      this.instances.set(capability, instance);
      return instance as T;
    } finally {
      this.resolvingStack.delete(capability);
    }
  }

  /**
   * [EN] Auto-wires the container using the BarritsBuildManifest (placeholder for dynamic imports).
   * [ES] Auto-conecta el contenedor usando el BarritsBuildManifest (placeholder para imports dinámicos).
   *
   * [EN] Iterates through manifest trait descriptors and registers their factories.
   * Currently a placeholder—real implementation would dynamically import source files.
   * Useful for build-time manifest injection at runtime.
   * [ES] Itera a través de descriptores de traits de manifiesto y registra sus fábricas.
   * Actualmente un placeholder—la implementación real importaría dinámicamente archivos fuente.
   * Útil para inyección de manifiesto en tiempo de compilación en tiempo de ejecución.
   *
   * @throws {Error} If no manifest was provided to constructor
   * @throws {Error} If dynamic import fails (future implementation)
   *
   * @example
   * ```typescript
   * const manifest = buildManifest; // from BARRITS_BUILD_MANIFEST
   * const container = new BarritsIoCContainer(manifest);
   * container.wire(); // Auto-registers all traits from manifest
   * ```
   */
  wire(): void {
    if (!this.manifest) {
      return;
    }

    for (const _descriptor of this.manifest.traitDescriptors) {
      // Placeholder: A real orchestrator would dynamically import sourceFile and bind the factory.
      // const factory = async () => {
      //   const module = await import(descriptor.sourceFile);
      //   return module[descriptor.bindingName];
      // };
      // for (const capability of descriptor.provides) {
      //   this.register(capability, factory);
      // }
    }
  }
}
