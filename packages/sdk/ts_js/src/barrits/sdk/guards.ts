import type { BarritsExportVisibility, BarritsFileKind } from "./contracts";

const FILE_KINDS = new Set<BarritsFileKind>(["barrel", "internal", "trait", "shared", "domain", "sdk", "root"]);
const EXPORT_VISIBILITIES = new Set<BarritsExportVisibility>(["public", "internal"]);

export const isBarritsFileKind = (value: string): value is BarritsFileKind => {
  return FILE_KINDS.has(value as BarritsFileKind);
};

export const isBarritsExportVisibility = (value: string): value is BarritsExportVisibility => {
  return EXPORT_VISIBILITIES.has(value as BarritsExportVisibility);
};