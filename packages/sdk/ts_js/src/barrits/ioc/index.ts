import type { BarritsBuildManifest } from "../sdk/contracts";

/**
 * [EN] Factory function type for generating capability instances.
 * [ES] Tipo de función de fábrica para generar instancias de capacidades.
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
   * [EN] Initializes the IoC container.
   * [ES] Inicializa el contenedor IoC.
   */
  constructor(manifest?: BarritsBuildManifest) {
    this.manifest = manifest;
  }

  /**
   * [EN] Registers a factory for a capability.
   * [ES] Registra una fábrica para una capacidad.
   */
  register<T>(capability: string, factory: Factory<T>): void {
    this.factories.set(capability, factory);
  }

  /**
   * [EN] Checks whether a capability is registered or already resolved.
   * [ES] Comprueba si una capacidad está registrada o ya resuelta.
   */
  has(capability: string): boolean {
    return this.factories.has(capability) || this.instances.has(capability);
  }

  /**
   * [EN] Unregisters a capability and clears its cached instance.
   * [ES] Anula el registro de una capacidad y borra su instancia en caché.
   */
  unregister(capability: string): void {
    this.factories.delete(capability);
    this.instances.delete(capability);
  }

  /**
   * [EN] Resolves a capability from the container, detecting circular dependencies.
   * [ES] Resuelve una capacidad del contenedor, detectando dependencias circulares.
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
