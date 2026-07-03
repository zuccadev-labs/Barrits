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
  private get Deno() {
    return (globalThis as unknown as { Deno: DenoNamespace }).Deno;
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
    return entries.filter((e) => e.type === "directory").map((e) => e.name);
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
    const process = await runtimeImport<typeof import("node:process")>("node:process");
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
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
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
