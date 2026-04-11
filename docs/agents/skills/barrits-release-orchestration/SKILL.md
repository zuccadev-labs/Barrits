---
name: barrits-release-orchestration
description: Use this skill when preparing and executing barrits prerelease and stable release flows for npm, JSR, and GitHub Releases. Apply it for tag strategy, version alignment, publication checks, and release-grade verification.
---

# Barrits Release Orchestration

## When To Use
Use this skill when the user asks to:
- Publish prerelease and stable release from a controlled code line.
- Verify npm and JSR package visibility and docs rendering.
- Ensure release workflows are deterministic and auditable.

## Release Policy
- Prerelease tag format: pre-vX.Y.Z-rc.N (target branch: dev, npm dist-tag: next).
- Stable tag format: vX.Y.Z (target branch: main, npm dist-tag: latest).
- package.json and jsr.json versions must match the tag version exactly.

## Preflight Checklist
- [ ] Clean working tree and synced remote branch.
- [ ] Version parity across package.json and jsr.json.
- [ ] CI green on release candidate commit.
- [ ] NPM and JSR credentials available in workflow environments.

## Execution Workflow
1. Create or move the prerelease tag to the intended commit.
2. Run release workflow for prerelease with npm+JSR publish enabled.
3. Verify package visibility and README/docs rendering in npm and JSR.
4. Promote same code line to stable release tag after approval.
5. Run stable release workflow and verify publication again.

## Verification Commands
```bash
npm view @zuccadev-labs/barrits version --tag next
npm view @zuccadev-labs/barrits readme --tag next
```

```bash
npm view @zuccadev-labs/barrits version --tag latest
npm view @zuccadev-labs/barrits readme --tag latest
```

```bash
npx jsr info @zuccadev-labs/barrits
```

## Gotchas
- If npm returns EOTP, token permissions or 2FA mode are not aligned.
- Release tags must point to commits contained in the expected target branch.
- Avoid re-tagging without documenting why and where.

## Release Output Template
```markdown
## Publication Results
- prerelease: success/failure
- release: success/failure

## Registry Visibility
- npm package/version/readme status
- JSR package/version/readme status

## Evidence
- Workflow run IDs and key job outcomes.
```
