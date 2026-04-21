# Commands and Runtimes

The Barrits CLI is not the primary integration path, but serves as an operational fallback, diagnostic tool, and automation trigger when resolution needs to be driven directly from Node.js or Deno.

## Node.js CLI

The package installs two binary aliases: `barrits` and `brt`.

```bash
npx barrits detect
npx brt detect --json
barrits info
barrits watch
barrits imports --write
barrits build -- npm run build
barrits dev -- npm run dev
```

## Deno CLI

In Deno, the runtime entrypoint is used directly rather than the npm `bin` field.

```bash
deno run -A ./dist/adapters/deno/cli.js detect
deno run -A ./dist/adapters/deno/cli.js watch
deno run -A ./dist/adapters/deno/cli.js imports --write
deno run -A ./dist/adapters/deno/cli.js build -- deno task build
deno run -A ./dist/adapters/deno/cli.js dev -- deno task dev
```

## Command Reference

| Command | What it does |
| :--- | :--- |
| `detect` | Confirms the location of the `barrits/` directory |
| `info` | Inspects domains, files, exports, traits, and import actions |
| `watch` | Keeps discovery alive during a development session |
| `imports` | Generates suggested actions and managed imports |
| `build` | Materializes a manifest ready for the build pipeline |
| `dev` | Couples watch to the parent development process |

## When Automatic Discovery Is Sufficient

Automatic discovery works without manual path configuration when the process starts:

- From the consumer's root directory
- From a subdirectory of the consumer
- From `barrits/` directly
- From cases like `src/barrits/`

## When to Specify `projectRoot` Explicitly

Explicit path configuration is needed when `cwd` is not a reliable signal — for example in wrappers, CI environments, monorepos with multiple candidates, or executions from parent directories.

---

[← Automation and Configuration](05-automation-and-configuration.md) | [Manifests, Bundlers, and Consumption →](07-manifests-bundlers-and-consumption.md)
