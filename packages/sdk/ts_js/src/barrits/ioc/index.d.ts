import type { BarritsBuildManifest } from "../sdk/contracts";
/**
 * [EN] Factory function type for generating capability instances.
 * [ES] Tipo de función de fábrica para generar instancias de capacidades.
 */
export type Factory<T = any> = (container: BarritsIoCContainer) => T | Promise<T>;
/**
 * [EN] Dynamic Inversion of Control (IoC) Container powered by AST Trait discovery.
 * [ES] Contenedor dinámico de Inversión de Control (IoC) impulsado por el descubrimiento de Traits AST.
 */
export declare class BarritsIoCContainer {
  private readonly instances;
  private readonly factories;
  private readonly manifest?;
  /**
   * [EN] Initializes the IoC container.
   * [ES] Inicializa el contenedor IoC.
   */
  constructor(manifest?: BarritsBuildManifest);
  /**
   * [EN] Registers a factory for a capability.
   * [ES] Registra una fábrica para una capacidad.
   */
  register<T>(capability: string, factory: Factory<T>): void;
  /**
   * [EN] Resolves a capability from the container.
   * [ES] Resuelve una capacidad del contenedor.
   */
  resolve<T>(capability: string): Promise<T>;
  /**
   * [EN] Auto-wires the container using the BarritsBuildManifest.
   * [ES] Auto-conecta el contenedor utilizando el BarritsBuildManifest.
   */
  wire(): Promise<void>;
}
