import ts from "typescript";
/**
 * Retrieves a cached Abstract Syntax Tree (AST) source file for a given path and string source.
 * If the path is un-cached or the string source has been mutated, the cache will parse and
 * register a new source file. This operates exactly with a 0ms overhead hit on differential re-reads.
 *
 * @param relativePath - The portable relative path referencing the original disk file.
 * @param source - The raw string representation of the source code currently held in memory.
 * @returns An immutable Typescript SourceFile AST object.
 */
export declare const createCachedSourceFile: (relativePath: string, source: string) => ts.SourceFile;
/**
 * Purges the internal AST cache mapping entirely.
 * Used primarily for explicit GC or memory releases in long-running watcher processes.
 */
export declare const clearAstCache: () => void;
