export type RuntimeName = "node" | "deno" | "unknown";

export type PathParts = {
  readonly segments: string[];
  readonly query: Record<string, string>;
};