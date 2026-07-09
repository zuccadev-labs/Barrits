/**
 * @module
 * [EN] Cross-platform filesystem adapters for Deno and Node.js, with dynamic runtime detection.
 * [ES] Adaptadores multiplataforma del sistema de archivos para Deno y Node.js, con detección dinámica del entorno.
 */
import { detectRuntime } from "../internal/runtime";
import type { RuntimeFileSystemAdapter, RuntimeFileSystemEntry } from "./contracts";

interface DenoNamespace {
  cwd(): string;
  stat(path: string): Promise<{ isDirectory: boolean }>;
  readDir(path: string): AsyncIterable<{ name: string; isDirectory: boolean }>;
  readTextFile(path: string): Promise<string>;
}

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  return import(specifier) as Promise<TModule>;
};

/**
 * [EN] Native Deno implementation of the filesystem adapter.
 * [ES] Implementación nativa de Deno del adaptador de sistema de archivos.
 */
export class DenoFileSystemAdapter implements RuntimeFileSystemAdapter {
  /** [EN] Provides access to the Deno runtime global. [ES] Proporciona acceso al global de runtime Deno. */
  private get Deno(): DenoNamespace {
    return (globalThis as unknown as { Deno: DenoNamespace }).Deno;
  }

  /** [EN] Returns the current working directory. [ES] Devuelve el directorio de trabajo actual. */
  cwd(): string {
    return this.Deno.cwd();
  }

  /** [EN] Checks if a directory exists at the given path. [ES] Comprueba si existe un directorio en la ruta dada. */
  async directoryExists(path: string): Promise<boolean> {
    try {
      const info = await this.Deno.stat(path);
      return info.isDirectory;
    } catch {
      return false;
    }
  }

  /** [EN] Lists subdirectories in the given path. [ES] Lista los subdirectorios en la ruta dada. */
  async listDirectories(path: string): Promise<string[]> {
    const entries = await this.listEntries(path);
    return entries.filter((e) => e.type === "directory").map((e) => e.name);
  }

  /** [EN] Lists all entries (files and directories) in the given path. [ES] Lista todas las entradas en la ruta dada. */
  async listEntries(path: string): Promise<RuntimeFileSystemEntry[]> {
    const results: RuntimeFileSystemEntry[] = [];
    for await (const entry of this.Deno.readDir(path)) {
      results.push({
        name: entry.name,
        type: entry.isDirectory ? "directory" : "file",
      });
    }
    return results;
  }

  /** [EN] Reads a text file at the given path. [ES] Lee un archivo de texto en la ruta dada. */
  readTextFile(path: string): Promise<string> {
    return this.Deno.readTextFile(path);
  }
}

/**
 * [EN] Native Node.js implementation of the filesystem adapter.
 * [ES] Implementación nativa de Node.js del adaptador de sistema de archivos.
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
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    const entries = await fs.readdir(path, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  /** [EN] Lists all entries (files and directories) in the given path. [ES] Lista todas las entradas en la ruta dada. */
  async listEntries(path: string): Promise<RuntimeFileSystemEntry[]> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    const entries = await fs.readdir(path, { withFileTypes: true });
    return entries.map((e) => ({
      name: e.name,
      type: e.isDirectory() ? "directory" : "file",
    }));
  }

  /** [EN] Reads a text file at the given path. [ES] Lee un archivo de texto en la ruta dada. */
  async readTextFile(path: string): Promise<string> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    return fs.readFile(path, "utf-8");
  }
}

/**
 * [EN] Factory method to create the appropriate filesystem adapter for the current runtime.
 * [ES] Método de factoría para crear el adaptador de sistema de archivos adecuado para el entorno actual.
 *
 * @returns [EN] A concrete RuntimeFileSystemAdapter instance. [ES] Una instancia concreta de RuntimeFileSystemAdapter.
 */
export const createRuntimeFileSystemAdapter = (): RuntimeFileSystemAdapter => {
  const runtime = detectRuntime();

  if (runtime === "deno") {
    return new DenoFileSystemAdapter();
  }

  if (runtime === "node") {
    return new NodeFileSystemAdapter();
  }

  throw new Error(`Unsupported runtime for filesystem operations: ${runtime}`);
};
