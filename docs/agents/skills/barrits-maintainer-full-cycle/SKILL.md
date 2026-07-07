---
name: barrits-maintainer-full-cycle
description: Use this skill when performing a full maintenance cycle on the Barrits SDK: version bump, changelog update, build verification, and publication to npm and JSR.
---

# Barrits Maintainer — Full Cycle

## When To Use

Apply this skill when you need to execute a complete release cycle for `@zuccadev-labs/barrits`:
- Version bump (prerelease `-rc.N` or stable)
- Changelog governance
- Build + test + typecheck verification
- Tagging and publication

## Pre-Flight Checklist

- [ ] Current branch is `dev` (prerelease) or `main` (stable)
- [ ] Working tree is clean (`git status`)
- [ ] All CI checks pass on the target branch
- [ ] `npm test` passes from SDK root: 935+ tests, 0 failures
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm audit` — no critical/high vulnerabilities

## Version Alignment

Both `packages/sdk/ts_js/package.json` and `packages/sdk/ts_js/jsr.json` must have the same version.

```bash
# Read current version
node -e "console.log(require('./packages/sdk/ts_js/package.json').version)"

# Bump version (example: 0.1.9 -> 0.2.0-rc.1)
npm version prerelease --preid rc --no-git-tag-version
```

Sync `jsr.json`:
```bash
node -e "
const pkg = require('./packages/sdk/ts_js/package.json');
const fs = require('fs');
const jsr = JSON.parse(fs.readFileSync('./packages/sdk/ts_js/jsr.json', 'utf-8'));
jsr.version = pkg.version;
fs.writeFileSync('./packages/sdk/ts_js/jsr.json', JSON.stringify(jsr, null, 2) + '\n');
"
```

## Changelog Governance

Update `CHANGELOG.md` at the root:

1. Move items from `[Unreleased]` to the new version section
2. Format:
   ```markdown
   ## [0.2.0-rc.1] — 2026-07-06
   ### Added
   - ...

   ### Fixed
   - ...

   ### Changed
   - ...
   ```
3. Add compare link at the bottom:
   ```markdown
   [0.2.0-rc.1]: https://github.com/zuccadev-labs/barrits/compare/v0.1.9...v0.2.0-rc.1
   ```

## Build & Verify

```bash
# Full validation
cd packages/sdk/ts_js
npm run build
npm run typecheck
npm test

# JSR surface validation
npm run publish:jsr:dry-run
```

## Tag & Publish

### Prerelease (to `next`)

```bash
git add -A
git commit -m "chore(release): bump to 0.2.0-rc.1"
git tag pre-v0.2.0-rc.1
git push && git push --tags
```

The CI pipeline will publish to npm with tag `next` and to JSR via OIDC.

### Stable (to `latest`)

```bash
git checkout main
git merge dev
git add -A
git commit -m "chore(release): v0.2.0"
git tag v0.2.0
git push && git push --tags
```

## Post-Release Verification

```bash
npm view @zuccadev-labs/barrits version
npx jsr info @zuccadev-labs/barrits
```

## References

- `docs/package/` — Full publication governance documentation (EN/ES)
- `docs/agents/skills/barrits-release-orchestration/` — Release orchestration deep-dive
- `.opencode/skills/development-workflow/` — Commit and branch conventions
- `.opencode/skills/emergency-release/` — Hotfix process for critical patches
