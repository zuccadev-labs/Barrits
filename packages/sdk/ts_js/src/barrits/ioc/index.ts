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
   * [EN] Resolves a capability from the container.
   * [ES] Resuelve una capacidad del contenedor.
   */
  async resolve<T>(capability: string): Promise<T> {
    if (this.instances.has(capability)) {
      return this.instances.get(capability) as T;
    }

    const factory = this.factories.get(capability);
    if (!factory) {
      throw new Error(`[Barrits IoC] Unresolved dependency: Cannot find factory for capability '${capability}'`);
    }

    const instance = await factory(this);
    this.instances.set(capability, instance);
    return instance as T;
  }

  /**
   * [EN] Auto-wires the container using the BarritsBuildManifest.
   * [ES] Auto-conecta el contenedor utilizando el BarritsBuildManifest.
   */
  async wire(): Promise<void> {
    if (!this.manifest) {
      return;
    }

    for (const descriptor of this.manifest.traitDescriptors) {
      // Automatic wiring based on provides and requires can be deeply expanded here.
      // For now, we index provided capabilities if they map directly to known instances.
      if (descriptor.provides && descriptor.provides.length > 0) {
        for (const capability of descriptor.provides) {
          if (!this.factories.has(capability)) {
            // Placeholder: A real orchestrator would dynamically import the sourceFile and bind the factory.
            // this.factories.set(capability, async () => { ... })
          }
        }
      }
    }
  }
}
