#!/usr/bin/env node
/**
 * @module
 * [EN] Executable entrypoint for the Node.js CLI. Runs unconditionally so it stays correct
 * when bundled (code splitting moves `import.meta.url` into shared chunks) and when invoked
 * through package-manager shims or symlinks.
 * [ES] Punto de entrada ejecutable de la CLI de Node.js. Se ejecuta de forma incondicional para
 * seguir siendo correcto al empaquetarse (el code splitting mueve `import.meta.url` a chunks
 * compartidos) y al invocarse mediante shims o symlinks del gestor de paquetes.
 */
import { runNodeCli } from "./cli";

void runNodeCli()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
