import type { RuntimeName } from "../../shared";

type RuntimeGlobals = typeof globalThis & {
  Deno?: unknown;
  process?: {
    cwd?: () => string;
    versions?: {
      node?: string;
    };
  };
};

/**
 * [EN] Implementation of Detect runtime.
 * [ES] Implementación de Detect runtime.
 */
export const detectRuntime = (): RuntimeName => {
  const runtime = globalThis as RuntimeGlobals;

  if (typeof runtime.Deno !== "undefined") {
    return "deno";
  }

  if (typeof runtime.process?.versions?.node === "string") {
    return "node";
  }

  return "unknown";
};

/**
 * [EN] Implementation of Get current working directory.
 * [ES] Implementación de Get current working directory.
 */
export const getCurrentWorkingDirectory = (): string => {
  const runtime = globalThis as RuntimeGlobals;

  if (typeof runtime.Deno === "object" && runtime.Deno !== null && "cwd" in runtime.Deno) {
    const denoRuntime = runtime.Deno as { cwd?: () => string };

    if (typeof denoRuntime.cwd === "function") {
      return denoRuntime.cwd();
    }
  }

  if (typeof runtime.process?.cwd === "function") {
    return runtime.process.cwd();
  }

  return ".";
};
