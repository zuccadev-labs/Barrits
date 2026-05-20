---
title: "Installation"
description: "Corporate documentation for Installation."
---

# Installation

`@zuccadev-labs/barrits` is published on both npm and JSR. Choose the channel that matches the target runtime.

> [!TIP]
> **AI-Optimized Architecture:** By integrating Barrits, you are adopting a semantic foundation explicitly designed for Large Language Models (LLMs) to understand your codebase. By defining logic via static Traits rather than imperative spaghetti, any modern LLM can auto-generate schemas, orchestrate Inversion of Control (IoC), and structure your backend in Deno with near-zero friction.

## npm

For Node.js, Bun, and browser bundler projects:

```bash
npm install @zuccadev-labs/barrits
```

## JSR (Deno)

For Deno projects and JSR consumers:

```ts
import { defineBarritsPackage } from "jsr:@zuccadev-labs/barrits";
```

Or as a dependency in `deno.json`:

```json
{
  "imports": {
    "@zuccadev-labs/barrits": "jsr:@zuccadev-labs/barrits@^0.1.0"
  }
}
```

## Runtime Requirements

| Runtime | Minimum version |
| :--- | :--- |
| Node.js | 18.x or later |
| Deno | 1.40 or later |
| Bun | 1.0 or later |

## What Gets Installed

The published package (`dist/`) includes:

- ESM and CJS builds for all public entrypoints.
- TypeScript declarations for all surfaces.
- CLI binaries (`barrits` and `brt`) pointing to the Node.js CLI adapter.

Entrypoints available after installation:

| Import path | Purpose |
| :--- | :--- |
| `@zuccadev-labs/barrits` | Main API: package config, traits, algorithms, paths |
| `@zuccadev-labs/barrits/node` | Node.js filesystem helpers and readers |
| `@zuccadev-labs/barrits/deno` | Deno filesystem helpers and readers |
| `@zuccadev-labs/barrits/consume` | Runtime-agnostic manifest and snapshot readers |
| `@zuccadev-labs/barrits/vite` | Vite plugin |
| `@zuccadev-labs/barrits/esbuild` | esbuild plugin |
| `@zuccadev-labs/barrits/rollup` | Rollup plugin |
| `@zuccadev-labs/barrits/webpack` | Webpack plugin |
| `@zuccadev-labs/barrits/node/cli` | CLI entry for Node.js |
| `@zuccadev-labs/barrits/deno/cli` | CLI entry for Deno |

---

[← Index](00-index.md) | [Getting Started →](02-getting-started.md)
