import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { BarritsBuildManifest } from "../../src/barrits/sdk";

export const writeProjectFile = async (
  projectRoot: string,
  relativePath: string,
  source: string,
): Promise<string> => {
  const filePath = join(projectRoot, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, source, "utf8");
  return filePath;
};

export const extractManifestFromModuleSource = (source: string): BarritsBuildManifest | null => {
  const match = source.match(/export const manifest = ([\s\S]*?);\nexport default manifest;/);

  if (!match) {
    return null;
  }

  return JSON.parse(match[1]) as BarritsBuildManifest;
};

export const normalizePathSlashes = (path: string): string => path.replace(/\\/g, "/");

export const createAutomationProjectFixture = async (
  projectRoot: string,
  options: {
    barritsRoot?: string;
    targetPath?: string;
  } = {},
): Promise<{ targetPath: string }> => {
  const barritsRoot = options.barritsRoot ?? "barrits";
  const targetFile = options.targetPath ?? "src/main.ts";

  await writeProjectFile(projectRoot, `${barritsRoot}/index.ts`, 'export { duplicar } from "./logic";\n');
  await writeProjectFile(projectRoot, `${barritsRoot}/logic/index.ts`, 'export { duplicar } from "./duplicar";\n');
  await writeProjectFile(projectRoot, `${barritsRoot}/logic/duplicar.ts`, "export const duplicar = (value: number) => value * 2;\n");
  const targetPath = await writeProjectFile(projectRoot, targetFile, "console.log('ready');\n");

  return { targetPath };
};
