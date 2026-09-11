/**
 * @module
 * [EN] Node.js (and Bun) runtime I/O for the Barrits CLI. All command logic lives in `src/barrits/sdk/cli-core.ts`;
 * this module only implements the `CliRuntimeIo` trait with Node primitives.
 * [ES] E/S de runtime Node.js (y Bun) para la CLI de Barrits. Toda la lógica de comandos vive en
 * `src/barrits/sdk/cli-core.ts`; este módulo solo implementa el trait `CliRuntimeIo` con primitivas de Node.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

import { createNodeFileSystemAdapter } from "../../src/barrits/sdk/adapters";
import { runCli, type CliRuntimeIo } from "../../src/barrits/sdk/cli-core";

const WINDOWS_PACKAGE_MANAGERS = new Set(["npm", "npx", "pnpm", "yarn"]);
const DEFAULT_CHILD_TIMEOUT_MS = 600_000;

const isWindowsPackageManagerCommand = (command: string): boolean => {
  return process.platform === "win32" && WINDOWS_PACKAGE_MANAGERS.has(command);
};

const quoteCmdArgument = (value: string): string => {
  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
};

const resolveChildTimeout = (): number => {
  const raw = process.env.BARRITS_CHILD_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CHILD_TIMEOUT_MS;
};

const runNodeChildCommand = (childArgs: readonly string[], cwd: string, envVars: Readonly<Record<string, string>>): Promise<number> => {
  if (childArgs.length === 0) {
    return Promise.resolve(0);
  }

  return new Promise<number>((resolvePromise) => {
    const [command, ...args] = childArgs;
    const usesCmdShim = isWindowsPackageManagerCommand(command);
    const child = spawn(
      usesCmdShim ? (process.env.ComSpec ?? "cmd.exe") : command,
      usesCmdShim ? ["/d", "/s", "/c", [`${command}.cmd`, ...args].map(quoteCmdArgument).join(" ")] : args,
      {
        cwd,
        stdio: "inherit",
        shell: false,
        env: { ...process.env, ...envVars },
      },
    );

    const stopChild = (): void => {
      child.kill("SIGTERM");
    };

    const timeoutId = setTimeout(stopChild, resolveChildTimeout());
    process.once("SIGINT", stopChild);
    process.once("SIGTERM", stopChild);

    const finish = (exitCode: number): void => {
      clearTimeout(timeoutId);
      process.off("SIGINT", stopChild);
      process.off("SIGTERM", stopChild);
      resolvePromise(exitCode);
    };

    child.once("error", () => finish(1));
    child.once("exit", (code, signal) => finish(signal !== null ? 1 : (code ?? 0)));
  });
};

/**
 * [EN] Creates the Node.js/Bun implementation of the CLI runtime trait.
 * [ES] Crea la implementación Node.js/Bun del trait de runtime de la CLI.
 */
export const createNodeCliRuntime = (): CliRuntimeIo => ({
  name: typeof (globalThis as { Bun?: unknown }).Bun === "undefined" ? "node" : "bun",
  commandPrefixes: ["barrits", "brt"],
  filesystem: createNodeFileSystemAdapter(),
  resolvePath: (...segments) => resolve(...segments),
  ensureTextFile: async (filePath, content) => {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
  },
  readTextFile: (filePath) => readFile(filePath, "utf8"),
  runChildCommand: runNodeChildCommand,
  watchDirectory: (directory, onChange) => {
    const watcher = watch(directory, { recursive: true }, () => onChange());
    return { close: () => watcher.close() };
  },
  waitForTermination: () =>
    new Promise<void>((resolvePromise) => {
      const stop = (): void => {
        process.off("SIGINT", stop);
        process.off("SIGTERM", stop);
        resolvePromise();
      };

      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);
    }),
});

/**
 * [EN] Runs the Barrits CLI on Node.js/Bun and returns the exit code.
 * [ES] Ejecuta la CLI de Barrits en Node.js/Bun y devuelve el código de salida.
 *
 * @param argumentsList - [EN] CLI arguments (defaults to `process.argv.slice(2)`). [ES] Argumentos de la CLI (por defecto `process.argv.slice(2)`).
 */
export const runNodeCli = async (argumentsList: readonly string[] = process.argv.slice(2)): Promise<number> => {
  return runCli(createNodeCliRuntime(), argumentsList);
};
