/**
 * @module
 * [EN] Deno runtime I/O for the Barrits CLI. All command logic lives in `src/barrits/sdk/cli-core.ts`; this module
 * only implements the `CliRuntimeIo` trait with Deno primitives and exposes the executable entry.
 * [ES] E/S de runtime Deno para la CLI de Barrits. Toda la lógica de comandos vive en `src/barrits/sdk/cli-core.ts`;
 * este módulo solo implementa el trait `CliRuntimeIo` con primitivas de Deno y expone el punto de entrada ejecutable.
 */
import { createDenoFileSystemAdapter } from "../../src/barrits/sdk/adapters";
import { runCli, type CliRuntimeIo } from "../../src/barrits/sdk/cli-core";

type DenoSignal = "SIGINT" | "SIGTERM";

type DenoGlobals = {
  args: string[];
  cwd: () => string;
  build: { os: string };
  env: { toObject: () => Record<string, string> };
  exit: (code?: number) => void;
  watchFs: (path: string | string[], options?: { recursive?: boolean }) => AsyncIterable<unknown> & { close?: () => void };
  mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
  writeTextFile: (path: string, data: string) => Promise<void>;
  readTextFile: (path: string) => Promise<string>;
  addSignalListener: (signal: DenoSignal, handler: () => void) => void;
  removeSignalListener: (signal: DenoSignal, handler: () => void) => void;
  Command: new (
    command: string,
    options?: { args?: string[]; cwd?: string; env?: Record<string, string>; stdin?: "inherit"; stdout?: "inherit"; stderr?: "inherit" },
  ) => {
    spawn: () => { status: Promise<{ code: number }>; kill: (signal?: string) => void };
  };
};

const DEFAULT_CHILD_TIMEOUT_MS = 600_000;

const getDenoGlobals = (): DenoGlobals => {
  const runtime = (globalThis as { Deno?: DenoGlobals }).Deno;

  if (!runtime) {
    throw new Error("Deno runtime is not available.");
  }

  return runtime;
};

const dirname = (filePath: string): string => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const separatorIndex = normalizedPath.lastIndexOf("/");

  if (separatorIndex <= 0) {
    return ".";
  }

  return normalizedPath.slice(0, separatorIndex);
};

const isAbsoluteSegment = (segment: string): boolean => /^(?:[A-Za-z]:\/|\/)/.test(segment);

/**
 * [EN] Resolves path segments to an absolute, normalized POSIX-style path (drive letters preserved on Windows).
 * [ES] Resuelve segmentos a una ruta absoluta y normalizada estilo POSIX (letras de unidad preservadas en Windows).
 */
const resolveDenoPath = (...segments: string[]): string => {
  const resolved = segments
    .filter(Boolean)
    .map((segment) => segment.replace(/\\/g, "/"))
    .reduce(
      (currentPath, segment) =>
        isAbsoluteSegment(segment) ? segment : `${currentPath.replace(/\/+$/g, "")}/${segment.replace(/^\/+/, "")}`,
      getDenoGlobals().cwd().replace(/\\/g, "/"),
    );

  const isPosixAbsolute = resolved.startsWith("/");
  const driveLetterMatch = /^([A-Za-z]:\/)/.exec(resolved);
  const normalized: string[] = [];

  for (const part of resolved.replace(/^[A-Za-z]:\//, "").split("/")) {
    if (part === "." || part === "") continue;

    if (part === "..") {
      if (normalized.length > 0 && normalized[normalized.length - 1] !== "..") {
        normalized.pop();
      } else if (!isPosixAbsolute && !driveLetterMatch) {
        normalized.push("..");
      }

      continue;
    }

    normalized.push(part);
  }

  const joined = normalized.join("/");

  if (isPosixAbsolute) {
    return `/${joined}`;
  }

  return driveLetterMatch ? `${driveLetterMatch[1]}${joined}` : joined;
};

const runDenoChildCommand = async (
  childArgs: readonly string[],
  cwd: string,
  envVars: Readonly<Record<string, string>>,
): Promise<number> => {
  if (childArgs.length === 0) {
    return 0;
  }

  const runtime = getDenoGlobals();
  const denoEnv = runtime.env.toObject();
  const rawTimeout = Number(denoEnv.BARRITS_CHILD_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : DEFAULT_CHILD_TIMEOUT_MS;
  const [command, ...args] = childArgs;
  const child = new runtime.Command(command, {
    args,
    cwd,
    env: { ...denoEnv, ...envVars },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }).spawn();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Child process timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const status = await Promise.race([child.status, timeout]);
    return status.code;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * [EN] Creates the Deno implementation of the CLI runtime trait.
 * [ES] Crea la implementación Deno del trait de runtime de la CLI.
 */
export const createDenoCliRuntime = (): CliRuntimeIo => {
  const runtime = getDenoGlobals();

  return {
    name: "deno",
    commandPrefixes: ["deno run -A jsr:@zuccadev-labs/barrits/cli"],
    filesystem: createDenoFileSystemAdapter(),
    resolvePath: resolveDenoPath,
    ensureTextFile: async (filePath, content) => {
      await runtime.mkdir(dirname(filePath), { recursive: true });
      await runtime.writeTextFile(filePath, content);
    },
    readTextFile: (filePath) => runtime.readTextFile(filePath),
    runChildCommand: runDenoChildCommand,
    watchDirectory: (directory, onChange) => {
      const watcher = runtime.watchFs(directory, { recursive: true });
      let closed = false;

      void (async () => {
        try {
          for await (const _event of watcher) {
            if (closed) {
              return;
            }

            onChange();
          }
        } catch {
          // The iterator throws once the watcher is closed; nothing to report.
        }
      })();

      return {
        close: () => {
          if (closed) {
            return;
          }

          closed = true;
          watcher.close?.();
        },
      };
    },
    waitForTermination: () =>
      new Promise<void>((resolvePromise) => {
        const signals: DenoSignal[] = runtime.build.os === "windows" ? ["SIGINT"] : ["SIGINT", "SIGTERM"];
        const stop = (): void => {
          for (const signal of signals) {
            runtime.removeSignalListener(signal, stop);
          }

          resolvePromise();
        };

        for (const signal of signals) {
          runtime.addSignalListener(signal, stop);
        }
      }),
  };
};

/**
 * [EN] Runs the Barrits CLI on Deno and returns the exit code.
 * [ES] Ejecuta la CLI de Barrits en Deno y devuelve el código de salida.
 *
 * @param argumentsList - [EN] CLI arguments (defaults to `Deno.args`). [ES] Argumentos de la CLI (por defecto `Deno.args`).
 */
export const runDenoCli = async (argumentsList: readonly string[] = getDenoGlobals().args): Promise<number> => {
  return runCli(createDenoCliRuntime(), argumentsList);
};

if (import.meta.main) {
  void runDenoCli()
    .then((exitCode) => {
      getDenoGlobals().exit(exitCode);
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      getDenoGlobals().exit(1);
    });
}
