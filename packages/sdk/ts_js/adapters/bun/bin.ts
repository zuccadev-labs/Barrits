#!/usr/bin/env bun
/**
 * @module
 * [EN] Executable entrypoint for the Bun CLI. Bun reuses the Node.js command pipeline.
 * [ES] Punto de entrada ejecutable de la CLI de Bun. Bun reutiliza el pipeline de comandos de Node.js.
 */
import { runNodeCli } from "../node/cli";

void runNodeCli()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
