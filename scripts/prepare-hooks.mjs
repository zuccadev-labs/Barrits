#!/usr/bin/env node
/**
 * Points git at the versioned hooks directory (.husky) so the pre-commit gate runs for every clone.
 * Runs from the root `prepare` script; it is a no-op outside a git checkout (npm pack, tarballs) and in CI.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

if (process.env.CI || !existsSync(".git")) {
  process.exit(0);
}

try {
  execSync("git config core.hooksPath .husky", { stdio: "ignore" });
} catch {
  // git may be unavailable in some sandboxes; hooks are a convenience, never a hard failure.
}
