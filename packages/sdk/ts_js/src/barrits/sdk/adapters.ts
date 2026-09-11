/**
 * @module
 * [EN] The single implementation of the runtime filesystem port (`RuntimeFileSystemAdapter`) for Node.js/Bun and
 * Deno, plus factories and runtime detection. CLIs, bundler plugins and tests all consume these adapters; no
 * other module re-implements filesystem access.
 * [ES] Implementación única del port de filesystem (`RuntimeFileSystemAdapter`) para Node.js/Bun y Deno, más
 * factorías y detección de runtime. CLIs, plugins de bundler y tests consumen estos adaptadores; ningún otro
 * módulo reimplementa el acceso al filesystem.
 *
 * Error semantics shared by every adapter: `directoryExists` never throws; `listDirectories`, `listEntries` and
 * `readTextFile` propagate runtime errors (missing path, permissions) so callers can report them instead of
 * silently treating an unreadable directory as empty.
 */
import { detectRuntime } from "../internal/runtime";
import type { RuntimeFileSystemAdapter, RuntimeFileSystemEntry } from "./contracts";

type DenoNamespace = {
  cwd(): string;
  stat(path: string): Promise<{ isDirectory: boolean }>;
  readDir(path: string): AsyncIterable<{ name: string; isDirectory: boolean; isFile: boolean }>;
  readTextFile(path: string): Promise<string>;
};

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  return import(specifier) as Promise<TModule>;
};

const getDenoNamespace = (): DenoNamespace => {
  const runtime = (globalThis as { Deno?: DenoNamespace }).Deno;

  if (!runtime) {
    throw new Error("Deno runtime is not available.");
  }

  return runtime;
};

/**
 * [EN] Native Deno implementation of the filesystem adapter.
 * [ES] Implementación nativa de Deno del adaptador de sistema de archivos.
 */
export class DenoFileSystemAdapter implements RuntimeFileSystemAdapter {
  /** [EN] Returns the current working directory. [ES] Devuelve el directorio de trabajo actual. */
  cwd(): string {
    return getDenoNamespace().cwd();
  }

  /** [EN] Checks if a directory exists at the given path. [ES] Comprueba si existe un directorio en la ruta dada. */
  async directoryExists(path: string): Promise<boolean> {
    try {
      const info = await getDenoNamespace().stat(path);
      return info.isDirectory;
    } catch {
      return false;
    }
  }

  /** [EN] Lists subdirectories in the given path. [ES] Lista los subdirectorios en la ruta dada. */
  async listDirectories(path: string): Promise<string[]> {
    const entries = await this.listEntries(path);
    return entries.filter((entry) => entry.type === "directory").map((entry) => entry.name);
  }

  /** [EN] Lists files and directories in the given path. [ES] Lista archivos y directorios en la ruta dada. */
  async listEntries(path: string): Promise<RuntimeFileSystemEntry[]> {
    const results: RuntimeFileSystemEntry[] = [];

    for await (const entry of getDenoNamespace().readDir(path)) {
      if (!entry.isDirectory && !entry.isFile) {
        continue;
      }

      results.push({
        name: entry.name,
        type: entry.isDirectory ? "directory" : "file",
      });
    }

    return results;
  }

  /** [EN] Reads a text file at the given path. [ES] Lee un archivo de texto en la ruta dada. */
  readTextFile(path: string): Promise<string> {
    return getDenoNamespace().readTextFile(path);
  }
}

/**
 * [EN] Native Node.js implementation of the filesystem adapter (also used by Bun, which is Node-compatible).
 * [ES] Implementación nativa de Node.js del adaptador de sistema de archivos (usada también por Bun, compatible con Node).
 */
export class NodeFileSystemAdapter implements RuntimeFileSystemAdapter {
  /** [EN] Returns the current working directory. [ES] Devuelve el directorio de trabajo actual. */
  async cwd(): Promise<string> {
    const process = await runtimeImport<typeof import("node:process")>("node:process");
    return process.cwd();
  }

  /** [EN] Checks if a directory exists at the given path. [ES] Comprueba si existe un directorio en la ruta dada. */
  async directoryExists(path: string): Promise<boolean> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");

    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /** [EN] Lists subdirectories in the given path. [ES] Lista los subdirectorios en la ruta dada. */
  async listDirectories(path: string): Promise<string[]> {
    const entries = await this.listEntries(path);
    return entries.filter((entry) => entry.type === "directory").map((entry) => entry.name);
  }

  /** [EN] Lists files and directories in the given path. [ES] Lista archivos y directorios en la ruta dada. */
  async listEntries(path: string): Promise<RuntimeFileSystemEntry[]> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    const entries = await fs.readdir(path, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory() || entry.isFile())
      .map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
      }));
  }

  /** [EN] Reads a text file at the given path. [ES] Lee un archivo de texto en la ruta dada. */
  async readTextFile(path: string): Promise<string> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    return fs.readFile(path, "utf-8");
  }
}

/**
 * [EN] Creates the Node.js/Bun filesystem adapter.
 * [ES] Crea el adaptador de filesystem de Node.js/Bun.
 *
 * @returns [EN] A `RuntimeFileSystemAdapter` backed by `node:fs/promises`. [ES] Un `RuntimeFileSystemAdapter` respaldado por `node:fs/promises`.
 */
export const createNodeFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  return new NodeFileSystemAdapter();
};

/**
 * [EN] Creates the Deno filesystem adapter. Throws when the `Deno` global is not available.
 * [ES] Crea el adaptador de filesystem de Deno. Lanza cuando el global `Deno` no está disponible.
 *
 * @returns [EN] A `RuntimeFileSystemAdapter` backed by the Deno namespace. [ES] Un `RuntimeFileSystemAdapter` respaldado por el namespace Deno.
 */
export const createDenoFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  getDenoNamespace();
  return new DenoFileSystemAdapter();
};

/**
 * [EN] Creates the filesystem adapter matching the current runtime (Deno, or Node.js for Node and Bun).
 * [ES] Crea el adaptador de filesystem correspondiente al runtime actual (Deno, o Node.js para Node y Bun).
 *
 * @returns [EN] A concrete `RuntimeFileSystemAdapter` instance. [ES] Una instancia concreta de `RuntimeFileSystemAdapter`.
 * @throws Error - [EN] When no supported runtime is detected (browsers). [ES] Cuando no se detecta un runtime soportado (navegadores).
 */
export const createRuntimeFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  const runtime = detectRuntime();

  if (runtime === "deno") {
    return createDenoFileSystemAdapter();
  }

  if (runtime === "node") {
    return createNodeFileSystemAdapter();
  }

  throw new Error(`Unsupported runtime for filesystem operations: ${runtime}`);
};
