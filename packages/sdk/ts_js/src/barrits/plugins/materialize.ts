import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { BarritsBuildManifest } from "../sdk";
import { createManifestModuleSource } from "./shared";

export const ensureManifestModuleFile = async (
  filePath: string,
  manifest: BarritsBuildManifest | null,
  banner: string,
): Promise<void> => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, createManifestModuleSource(manifest, banner), "utf8");
};