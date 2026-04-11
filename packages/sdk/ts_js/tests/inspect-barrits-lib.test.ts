import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { createNodeFileSystemAdapter } from "../adapters/node/filesystem";
import { findBarritsDirectory, inspectBarritsIntegrations } from "../src/barrits/sdk";

const writeProjectFile = async (projectRoot: string, relativePath: string, source: string): Promise<void> => {
  const filePath = join(projectRoot, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, source, "utf8");
};

test("findBarritsDirectory ignores project-level barrits_lib folders", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-lib-ignore-"));

  await writeProjectFile(projectRoot, "barrits/logic/index.ts", 'export { sumar } from "./sumar";\n');
  await writeProjectFile(projectRoot, "barrits/logic/sumar.ts", "export const sumar = (left: number, right: number) => left + right;\n");
  await writeProjectFile(projectRoot, "barrits_lib/logic/index.ts", 'export { duplicar } from "./duplicar";\n');
  await writeProjectFile(projectRoot, "barrits_lib/logic/duplicar.ts", "export const duplicar = (value: number) => value * 2;\n");

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);
  assert.equal(discovery.barritsLibDirectory, undefined);
});

test("inspectBarritsIntegrations only inspects the consumer barrits layer", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "barrits-consumer-only-"));

  await writeProjectFile(projectRoot, "barrits/logic/index.ts", 'export { duplicar } from "./duplicar";\n');
  await writeProjectFile(projectRoot, "barrits/logic/duplicar.ts", "export const duplicar = (value: number) => value * 2;\n");
  await writeProjectFile(projectRoot, "barrits_lib/logic/index.ts", 'export { duplicar } from "./duplicar";\n');
  await writeProjectFile(projectRoot, "barrits_lib/logic/duplicar.ts", "export const duplicar = (value: number) => value + value;\n");

  const adapter = createNodeFileSystemAdapter();
  const discovery = await findBarritsDirectory(adapter, { startDirectory: projectRoot });

  assert.ok(discovery);
  const graph = await inspectBarritsIntegrations(adapter, discovery);
  const logicDomain = graph.domains.find((domain) => domain.name === "logic");

  assert.ok(logicDomain);
  assert.equal(graph.barritsLibDirectory, undefined);
  assert.equal(graph.libraryDomains.length, 0);
  assert.equal(graph.libraryRootFiles.length, 0);
  assert.equal(graph.collisions.length, 0);
  assert.ok(logicDomain.files.every((file) => file.sourceLayer === "barrits"));
  assert.ok(graph.importActions.some((action) => action.exportName === "duplicar"));
  assert.ok(graph.importActions.every((action) => action.exportName !== "sumar" || action.domain === "logic"));
});
