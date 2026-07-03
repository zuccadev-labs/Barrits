---
name: barrits-security-audit
description: Use this skill when performing security reviews, identifying vulnerabilities, or hardening the Barrits SDK. Covers path traversal, injection, permission boundaries, and supply chain risks.
---

# Barrits Security Audit

## Threat Model

| Risk | Location | Mitigation |
| :--- | :--- | :--- |
| Path traversal | `discovery.ts`, `resolveDenoPath` | Validate against root, reject `..` |
| `import()` injection | `adapters.ts`, `config.ts` | Only import known specifiers |
| `JSON.parse` bomb | `consume.ts` | Size limit via `parseJsonSource` |
| Command injection | `cli.ts` | `spawn` with `shell: false`, no string concatenation |
| Typosquatting | `package.json` deps | Verify `@types/node`, `typescript` versions |

## Security Gates

### Filesystem
- Always use `adapter.readTextFile` instead of raw `readFile`
- Path resolution must use `normalizePath` + prefix check
- Reject absolute paths in discovery context unless explicitly expected

### Child Processes
- `spawn` with `shell: false` (default)
- `CHILD_TIMEOUT_MS` env var (default: 600000ms)
- `SIGTERM` on timeout; `SIGKILL` not used directly

### Imports
- Dynamic `import()` limited to: `node:*`, known local modules
- Deno: uses `runtime.Command` API, no raw `Deno.run`

### Supply Chain
- `npm ci` in CI (locked, not `npm install`)
- `package-lock.json` committed
- `dependabot.yml` configured for weekly updates

## Verification Commands

```bash
# Lint security rules
npm run lint

# Dependency audit
npm audit

# Path traversal drill
node ../../node_modules/tsx/dist/cli.mjs adapters/node/cli.ts info --target ../etc/passwd
```
