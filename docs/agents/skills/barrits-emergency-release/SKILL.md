---
name: barrits-emergency-release
description: Emergency release process for hotfixes and critical security patches outside the normal release cycle. Use when a critical vulnerability or blocking bug requires immediate publication.
opencode_skill: .opencode/skills/emergency-release/skill.jsonc
---

# Barrits Emergency Release

## When To Use

Apply this skill only for urgent situations that cannot wait for the normal release cycle:

- **Security hotfix**: A CVE or critical vulnerability requires immediate patching
- **Critical bug fix**: A blocking bug prevents consumers from using the SDK
- **Rollback**: A released hotfix introduces a worse issue than it solved

## Branch Strategy

```
main ── hotfix/<description> ── (merge) ── main ── tag vX.Y.Z+N
                                              └── cherry-pick ── dev
```

## Workflow

### Security Hotfix

1. **Branch from `main`**:
   ```bash
   git checkout main && git pull
   git checkout -b hotfix/<security-description>
   ```

2. **Apply fix** with conventional commit:
   ```bash
   git commit -m 'fix(security): <description>'
   ```

3. **Update CHANGELOG** under `[Unreleased]` > `### Fixed`

4. **Create PR into `main`** with `hotfix` label:
   ```bash
   gh pr create --base main --head <branch> --label hotfix
   ```

5. **After merge, bump version** (patch):
   ```bash
   cd packages/sdk/ts_js
   npm version patch --no-git-tag-version
   ```

6. **Sync `jsr.json`** to match `package.json` version

7. **Commit and tag**:
   ```bash
   git add -A
   git commit -m 'chore(release): v<version>'
   git tag v<version>
   git push && git push --tags
   ```

8. **Cherry-pick into `dev`**:
   ```bash
   git checkout dev
   git cherry-pick main~1
   git push origin dev
   ```

9. **Verify publication**:
   ```bash
   npm view @zuccadev-labs/barrits version
   ```

### Critical Bug Fix

Same as security hotfix but without security-specific audit steps. Key differences:
- Can skip `npm audit` if urgency requires, but document the exception
- Use `fix(<scope>)` commit type instead of `fix(security)`

### Rollback

If a hotfix introduces a worse issue:

1. **Unpublish from npm** (only within 72 hours):
   ```bash
   npm unpublish @zuccadev-labs/barrits@<bad-version>
   ```

2. **Revert on `main`**:
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Cherry-pick revert to `dev`**:
   ```bash
   git checkout dev
   git cherry-pick <revert-hash>
   git push origin dev
   ```

4. **Document in CHANGELOG**:
   ```
   - Rolled back v<bad-version> due to <reason>
   ```

5. **Create new hotfix branch** from `main` to re-attempt

## Acceptance Criteria

- [ ] Hotfix branches from `main`, not `dev`
- [ ] CHANGELOG updated before merge
- [ ] Version bump is patch-only
- [ ] `jsr.json` is synced with `package.json`
- [ ] Tag is created and pushed
- [ ] Cherry-pick to `dev` is verified
- [ ] Publication is verified via `npm view`
- [ ] Rollback (if needed) is documented honestly

## References

- `.opencode/skills/emergency-release/skill.jsonc`
- `CHANGELOG.md` at project root
- `packages/sdk/ts_js/package.json`
- `packages/sdk/ts_js/jsr.json`
- Normal release: `docs/agents/skills/barrits-maintainer-full-cycle/SKILL.md`

