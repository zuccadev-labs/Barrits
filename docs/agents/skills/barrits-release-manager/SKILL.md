---
name: barrits-release-manager
description: Enterprise release management for the Barrits SDK: version alignment, changelog governance, OIDC-based publication to npm and JSR, and post-release verification across registries.
opencode_skill: .opencode/skills/release-manager/skill.jsonc
---

# Barrits Release Manager

## When To Use

This specialist role is activated for release lifecycle management:

- **Prerelease preparation**: Version bump, changelog update, tag creation, and publication to `next`
- **Stable release production**: Promote to `main`, final versioning, publication to `latest`
- **Post-release verification**: Confirm availability and integrity across npm, JSR, and GitHub
- **Release governance**: Ensure compliance with the formal release governance documented in `docs/package/`

## Release Types

| Type | Branch | Tag | npm Tag | Version Pattern |
| :--- | :----- | :-- | :------ | :-------------- |
| Prerelease | `dev` | `pre-vX.Y.Z-rc.N` | `next` | `0.2.0-rc.1` |
| Stable | `main` | `vX.Y.Z` | `latest` | `0.2.0` |
| Hotfix | `main` | `vX.Y.Z+N` | `latest` | `0.1.10` |

## Workflow

### Prerelease

1. **Verify branch**: Confirm on `dev` with clean working tree
2. **Bump version**:
   ```bash
   cd packages/sdk/ts_js
   npm version prerelease --preid rc --no-git-tag-version
   ```
3. **Sync `jsr.json`**: Match `package.json` version
4. **Update CHANGELOG**: Move `[Unreleased]` items to new version section
5. **Commit and tag**:
   ```bash
   git add -A
   git commit -m 'chore(release): v<version>'
   git tag pre-v<version>
   git push && git push --tags
   ```
6. **Monitor CI**: OIDC publication to npm (`next`) and JSR
7. **Verify**:
   ```bash
   npm view @zuccadev-labs/barrits version --tag next
   npx jsr info @zuccadev-labs/barrits
   ```

### Stable Release

1. **Promote to `main`**: Open a PR from `dev` to `main` with release notes
2. **Merge and pull**: `git checkout main && git pull`
3. **Bump to stable**:
   ```bash
   cd packages/sdk/ts_js
   npm version <major|minor|patch> --no-git-tag-version
   ```
4. **Sync `jsr.json`**
5. **Finalize CHANGELOG**: Update compare link and date
6. **Commit and tag**: `chore(release): v<version>` + `git tag v<version>`
7. **Push**: `git push && git push --tags`
8. **Verify**:
   ```bash
   npm view @zuccadev-labs/barrits version --tag latest
   npx jsr info @zuccadev-labs/barrits
   ```

### Hotfix

See `docs/agents/skills/barrits-emergency-release/SKILL.md` for the hotfix workflow.

## Publication Verification

After every release, verify all three registries:

```bash
# npm
npm view @zuccadev-labs/barrits dist-tags
# → { latest: '0.x.y', next: '0.x.y-rc.z' }

# JSR
npx jsr info @zuccadev-labs/barrits
# → Version matches

# GitHub
gh release list --limit 1
# → Tag matches
```

## Governance Documents

| Document | Location |
| :------- | :------- |
| Release readiness checklist | `docs/package/ES/05_listo-para-lanzamiento.md` |
| Publication guide | `docs/package/ES/03_publication.md` |
| CI/CD governance | `docs/package/ES/07_ci-cd-governance.md` |
| Changelog template | `CHANGELOG.md` |

## Acceptance Criteria

- [ ] `package.json` and `jsr.json` versions match
- [ ] CHANGELOG is up to date with all entries from `[Unreleased]`
- [ ] Tag follows the correct format for the release type
- [ ] CI pipeline completed successfully (OIDC-based publication)
- [ ] `npm view` shows the expected version on the correct tag
- [ ] `npx jsr info` shows the expected version
- [ ] GitHub Release is created with release notes

## References

- Release procedures (ES): `docs/package/ES/`
- Full maintenance cycle: `docs/agents/skills/barrits-maintainer-full-cycle/SKILL.md`
- Emergency release: `docs/agents/skills/barrits-emergency-release/SKILL.md`
- Release orchestration: `.opencode/skills/barrits-release-orchestration/skill.jsonc`

