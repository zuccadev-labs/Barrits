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

const LOG_LEVEL_PRIORITY: Record<BarritsLogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 4,
};

/**
 * [EN] Default industrial logger implementation using standard console.
 * Following SRP: This class only handles log formatting and level filtering.
 * [ES] Implementación predeterminada del logger industrial utilizando la consola estándar.
 * Siguiendo SRP: Esta clase solo maneja el formato de los logs y el filtrado por niveles.
 */
export class DefaultBarritsLogger implements BarritsLogger {
  constructor(public level: BarritsLogLevel = "info") {}

  private shouldLog(targetLevel: BarritsLogLevel): boolean {
    return LOG_LEVEL_PRIORITY[targetLevel] >= LOG_LEVEL_PRIORITY[this.level];
  }

  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [BARRITS] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.format("debug", message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(this.format("info", message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.format("warn", message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.format("error", message), ...args);
    }
  }
}

/**
 * [EN] Global default logger instance.
 * [ES] Instancia global del logger predeterminado.
 */
export const logger: BarritsLogger = new DefaultBarritsLogger();
