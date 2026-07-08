# 03 Secrets, Actions and Environments

Publication and continuous integration management are orchestrated via GitHub Actions, utilizing GitHub Environments and a minimal set of security secrets.

## OIDC-Based Publication Strategy

For the JSR registry, the system employs "Trusted Publishing" via the OIDC protocol in GitHub Actions. This configuration allows for publication without the need to store persistent tokens in repository secrets, provided the package is properly linked to the JSR account.

## Workflow Definitions

The repository maintains three primary workflows:

- **`.github/workflows/ci.yml`**: Executes build processes, type checking, unit tests, example execution, and JSR publication simulation (dry-run).
- **`.github/workflows/security.yml`**: Performs dependency reviews and security audits via `npm audit`.
- **`.github/workflows/release.yml`**: Orchestrates official deployment to npm and JSR.

## GitHub Environments

It is recommended to create and configure the following environments in the `Settings -> Environments` section of the repository:

- **`npm`**: Intended for the governance of Node.js package publication.
- **`jsr`**: Oriented toward Deno surface management and JSR publication.

## Secrets and Security Management

The following security standards are established for credential handling:

- **Prohibition of Plain Text Credentials**: Real tokens are not stored in the repository's `.env` files; these are reserved for local reference maps.
- **Trusted Publishing in npm**: Although OIDC is recommended for npm, the use of the `NPM_TOKEN_PUBLICAR_NPM` secret is permitted for the initial launch of new packages until the registry allows for trusted publishing configuration.
- **Workflow Permissions**: Declaring `permissions.id-token: write` is mandatory in the release workflow to enable OIDC token exchange.

## Branch Controls and Approval

The implementation of protections on the main branch (`main`) is prescribed, including mandatory reviews, approval of changes, and certification that all CI and Security checks are optimal prior to any merge or release launch.
