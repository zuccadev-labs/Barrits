import type { RuntimeName } from "../../shared";

type RuntimeGlobals = typeof globalThis & {
  Deno?: unknown;
  process?: {
    cwd?: () => string;
    versions?: {
      bun?: string;
      node?: string;
    };
  };
};

/**
 * [EN] Detects the host runtime: Deno (global `Deno`), Bun (`process.versions.bun`, checked before Node because Bun
 * also reports a Node version), Node (`process.versions.node`) or `unknown`.
 * [ES] Detecta el runtime anfitrión: Deno (global `Deno`), Bun (`process.versions.bun`, comprobado antes que Node
 * porque Bun también informa una versión de Node), Node (`process.versions.node`) o `unknown`.
 */
export const detectRuntime = (): RuntimeName => {
  const runtime = globalThis as RuntimeGlobals;

  if (typeof runtime.Deno !== "undefined") {
    return "deno";
  }

  if (typeof runtime.process?.versions?.bun === "string") {
    return "bun";
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
