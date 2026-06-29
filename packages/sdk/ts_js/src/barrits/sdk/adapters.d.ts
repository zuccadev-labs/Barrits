import type { RuntimeFileSystemAdapter, RuntimeFileSystemEntry } from "./contracts";
/**
 * [EN] Native Deno implementation of the filesystem adapter.
 * [ES] Implementación nativa de Deno del adaptador de sistema de archivos.
 */
export declare class DenoFileSystemAdapter implements RuntimeFileSystemAdapter {
    private get Deno();
    cwd(): string;
    directoryExists(path: string): Promise<boolean>;
    listDirectories(path: string): Promise<string[]>;
    listEntries(path: string): Promise<RuntimeFileSystemEntry[]>;
    readTextFile(path: string): Promise<string>;
}
/**
 * [EN] Native Node.js implementation of the filesystem adapter.
 * [ES] Implementación nativa de Node.js del adaptador de sistema de archivos.
 */
export declare class NodeFileSystemAdapter implements RuntimeFileSystemAdapter {
    cwd(): Promise<string>;
    directoryExists(path: string): Promise<boolean>;
    listDirectories(path: string): Promise<string[]>;
    listEntries(path: string): Promise<RuntimeFileSystemEntry[]>;
    readTextFile(path: string): Promise<string>;
}
/**
 * [EN] Factory method to create the appropriate filesystem adapter for the current runtime.
 * [ES] Método de factoría para crear el adaptador de sistema de archivos adecuado para el entorno actual.
 *
 * @returns [EN] A concrete RuntimeFileSystemAdapter instance. [ES] Una instancia concreta de RuntimeFileSystemAdapter.
 */
export declare const createRuntimeFileSystemAdapter: () => RuntimeFileSystemAdapter;
