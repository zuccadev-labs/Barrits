---
name: barrits-development-workflow
description: Standard development workflow for the Barrits SDK: conventional commits, branch strategy, PR creation, and changelog governance. Use when starting features, committing changes, or preparing pull requests.
opencode_skill: .opencode/skills/development-workflow/skill.jsonc
---

# Barrits Development Workflow

## When To Use

Apply this skill whenever you need to execute the standard contribution lifecycle:

- **Start feature**: Create a properly named branch from `dev`
- **Commit changes**: Write conventional commit messages and update CHANGELOG
- **Create PR**: Open a pull request with structured description and verification checklist
- **Update changelog**: Add well-categorized entries under `[Unreleased]`

## Branch Naming Convention

```
<type>/<kebab-case-description>

Types:
- feat/     — New feature or enhancement
- fix/      — Bug fix (including security)
- refactor/ — Code restructuring without behavior change
- docs/     — Documentation-only changes
- chore/    — Tooling, CI, dependency updates

Examples:
  feat/cross-runtime-summarization
  fix/manifest-checksum-ordering
  refactor/adapter-consolidation
  docs/phase-2-documentation-audit
  chore/dependabot-config-update
```

## Workflow

### 1. Start a Feature

```bash
git checkout dev
git pull
git checkout -b <type>/<description>
```

### 2. Commit Changes

After making changes and staging them (`git add`):

```bash
git commit -m '<type>(<scope>): <description>'
```

**Scopes**: `sdk`, `adapters`, `docs`, `examples`, `release`, `ci`, `deps`

**Rules**:
- Update `CHANGELOG.md` under `[Unreleased]` before committing
- Run `npm test` (Husky pre-commit hook enforces this)
- If pre-commit hook blocks due to known flaky test, use `git commit --no-verify` and document the exception
- Keep the commit focused: one logical change per commit
- Use imperative mood ("Add feature" not "Added feature" or "Adds feature")

### 3. Create a Pull Request

```bash
gh pr create \
  --base dev \
  --head <current-branch> \
  --title '<type>(<scope>): <description>' \
  --body '## Summary
<what changed>

## Motivation
<why>

## Verification
- [ ] npm run typecheck — 0 errors
- [ ] npm run lint — 0 errors/warnings
- [ ] npm test — all passing
- [ ] Examples build successfully

Closes #<issue>'
```

**PR Checklist**:
- [ ] Title follows conventional commit format
- [ ] Body explains what and why
- [ ] Verification checklist completed
- [ ] Link to related issue
- [ ] At least one reviewer assigned (if applicable)

### 4. Update Changelog

Edit `CHANGELOG.md` at the project root. Add entry under `[Unreleased]`:

```markdown
### Added
- Description of change ([#NNN](https://github.com/zuccadev-labs/barrits/pull/NNN))

### Fixed
- Description of fix ([#NNN](https://github.com/zuccadev-labs/barrits/pull/NNN))

### Changed
- Description of refactoring ([#NNN](https://github.com/zuccadev-labs/barrits/pull/NNN))
```

## Acceptance Criteria

- [ ] Branch is based off `dev` (unless hotfix, which is off `main`)
- [ ] Branch name follows `<type>/<description>` convention
- [ ] Commit message follows conventional commit format
- [ ] CHANGELOG updated before commit
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm test` passes (0 failures)
- [ ] PR has verification checklist completed

## References

- Conventional Commits: https://www.conventionalcommits.org/
- GitHub CLI: `gh` commands
- CHANGELOG: `CHANGELOG.md` at project root
- `.opencode/skills/development-workflow/skill.jsonc`

