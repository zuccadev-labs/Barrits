/**
 * @module
 * [EN] Placeholder module description.
 * [ES] Descripción de marcador de posición del módulo.
 */
import { detectRuntime } from "../internal/runtime";
import type { RuntimeFileSystemAdapter, RuntimeFileSystemEntry } from "./contracts";

/**
 * @module
 * [EN] Multi-platform filesystem adapters for Barrits. 
 * Provides deterministic implementations for Deno and Node.js runtimes.
 * [ES] Adaptadores de sistema de archivos multiplataforma para Barrits. 
 * Proporciona implementaciones deterministas para los entornos Deno y Node.js.
 */

const runtimeImport = <TModule>(specifier: string): Promise<TModule> => {
  const importModule = Function("specifier", "return import(specifier);") as (specifier: string) => Promise<TModule>;
  return importModule(specifier);
};

/**
 * [EN] Native Deno implementation of the filesystem adapter.
 * [ES] Implementación nativa de Deno del adaptador de sistema de archivos.
 */
export class DenoFileSystemAdapter implements RuntimeFileSystemAdapter {
  private get Deno() {
    return (globalThis as any).Deno;
  }

  cwd(): string {
    return this.Deno.cwd();
  }

  async directoryExists(path: string): Promise<boolean> {
    try {
      const info = await this.Deno.stat(path);
      return info.isDirectory;
    } catch {
      return false;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    const entries = await this.listEntries(path);
    return entries
      .filter((e) => e.type === "directory")
      .map((e) => e.name);
  }

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

  readTextFile(path: string): Promise<string> {
    return this.Deno.readTextFile(path);
  }
}

/**
 * [EN] Native Node.js implementation of the filesystem adapter.
 * [ES] Implementación nativa de Node.js del adaptador de sistema de archivos.
 */
export class NodeFileSystemAdapter implements RuntimeFileSystemAdapter {
  async cwd(): Promise<string> {
    const process = await runtimeImport<any>("node:process");
    return process.cwd();
  }

  async directoryExists(path: string): Promise<boolean> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    const entries = await fs.readdir(path, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  }

  async listEntries(path: string): Promise<RuntimeFileSystemEntry[]> {
    const fs = await runtimeImport<typeof import("node:fs/promises")>("node:fs/promises");
    const entries = await fs.readdir(path, { withFileTypes: true });
    return entries.map((e) => ({
      name: e.name,
      type: e.isDirectory() ? "directory" : "file",
    }));
  }

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

