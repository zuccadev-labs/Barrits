/**
 * @module
 * [EN] Industrial telemetry and logging system for Barrits.
 * Provides a standard, pluggable interface for observability across all runtimes.
 * [ES] Sistema de telemetría y registro industrial para Barrits.
 * Proporciona una interfaz estándar y conectable para la observabilidad en todos los entornos de ejecución.
 */
/**
 * [EN] Supported logging levels in the Barrits ecosystem.
 * [ES] Niveles de registro soportados en el ecosistema de Barrits.
 */
export type BarritsLogLevel = "debug" | "info" | "warn" | "error" | "off";
/**
 * [EN] Contract for industrial logging implementations.
 * [ES] Contrato para implementaciones de registro industrial.
 */
export interface BarritsLogger {
  /** [EN] Log level. [ES] Nivel de log. */
  level: BarritsLogLevel;
  /** [EN] Log debug message. [ES] Registrar mensaje de depuración. */
  debug(message: string, ...args: unknown[]): void;
  /** [EN] Log info message. [ES] Registrar mensaje informativo. */
  info(message: string, ...args: unknown[]): void;
  /** [EN] Log warning message. [ES] Registrar mensaje de advertencia. */
  warn(message: string, ...args: unknown[]): void;
  /** [EN] Log error message. [ES] Registrar mensaje de error. */
  error(message: string, ...args: unknown[]): void;
}
/**
 * [EN] Default industrial logger implementation using standard console.
 * Following SRP: This class only handles log formatting and level filtering.
 * [ES] Implementación predeterminada del logger industrial utilizando la consola estándar.
 * Siguiendo SRP: Esta clase solo maneja el formato de los logs y el filtrado por niveles.
 */
export declare class DefaultBarritsLogger implements BarritsLogger {
  level: BarritsLogLevel;
  constructor(level?: BarritsLogLevel);
  private shouldLog;
  private format;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
/**
 * [EN] Global default logger instance.
 * [ES] Instancia global del logger predeterminado.
 */
export declare const logger: BarritsLogger;
