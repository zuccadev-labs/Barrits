
# ADR 0001: Use Conventional Commits and Lint-Staged for Code Quality

## Status
Accepted (amended 2026-09-09, see below)

## Context
As part of improving the developer experience and code quality in the Barrits monorepo, we need to establish consistent practices for:
1. Commit messaging to generate meaningful changelogs
2. Pre-commit checks to ensure code quality before it enters the repository
3. Consistent code formatting across the project

## Decision
We will implement:
1. **Conventional Commits** for all commit messages to enable automated changelog generation
2. **Lint-Staged** with Prettier and ESLint to run formatting and linting on staged files before commits
3. **Husky** hooks to automate the pre-commit process

## Consequences
### Positive
- Consistent, meaningful commit messages that follow a standard format
- Automated code formatting and linting before code enters the repository
- Reduced noise in code reviews due to formatting issues
- Ability to automatically generate changelogs from commit history
- Improved code quality and maintainability

### Negative
- Initial learning curve for contributors unfamiliar with Conventional Commits
- Slightly longer commit process due to pre-commit hooks
- Need to maintain ESLint and Prettier configurations

## Implementation
1. Install required dependencies: husky, lint-staged, prettier, slint
2. Configure lint-staged to run Prettier and ESLint on staged files
3. Set up husky pre-commit hook to run lint-staged
4. Add ESLint and Prettier configuration files
5. Update CONTRIBUTING.md to document the new practices

## Related Decisions
- May eventually integrate with automated changelog tools (standard-version, changesets)
- Could be extended to include commitlint for enforcing conventional commits

## Amendment (2026-09-09)
The lint-staged part of this decision was never operational: `husky` and `lint-staged` were not listed in `package.json`, no `prepare` script installed the hooks, and `.husky/pre-commit` never invoked lint-staged, so `.lintstagedrc.json` was dead configuration. The audit of 2026-09 replaced it with a dependency-free mechanism:

- `scripts/prepare-hooks.mjs` (run by the root `prepare` script) sets `git config core.hooksPath .husky`.
- `.husky/pre-commit` runs the same gates as CI on the whole SDK: `npm run lint`, `npm run typecheck` and `npm test`, plus `git-secrets` when it is installed.
- `.lintstagedrc.json` was removed. Formatting is enforced by `npm run format` in CI (Prettier `--check`) and applied locally with `npm run format:write`.

Conventional Commits remain in force.

## References
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/#/)
- [Lint-Staged Documentation](https://github.com/lint-staged/lint-staged)

