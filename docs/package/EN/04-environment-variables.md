# 04 Environment Variables

The `.env` file is strictly organized by execution environments, using descriptive comments to ensure it acts as a coherent reference map rather than an unordered list of concepts.

## Reference Variable Map

The variables used in the repository orchestration are detailed below:

- **`NPM_TOKEN_PUBLICAR_NPM`**: Optional. Used for compatibility in initial npm publication if "Trusted Publishing" is not available.
- **`ENTORNO_PUBLICAR_NPM`**: Name of the GitHub environment configured for the npm channel.
- **`ENTORNO_PUBLICAR_JSR`**: Name of the GitHub environment configured for the JSR channel.
- **`RUTA_PAQUETE_PUBLICAR_NODE`**: Relative path of the npm package within the monorepo structure.
- **`RUTA_CONFIG_PUBLICAR_JSR`**: Path to the `jsr.json` file governing Deno publication.
- **`TAG_VERSION_PUBLICAR`**: Expected tag identifier for the release (e.g., `v0.1.0`).
- **`RAMA_PROTEGIDA_INTEGRAR`**: Definition of the protected production branch (e.g., `main`).

## Usage and Security Standards

To maintain compliance with corporate security standards, the following rules apply:

1.  **Credential Isolation**: Real credential values must never be included in the `.env` file. These values reside exclusively in GitHub secrets or the corporate secret manager.
2.  **Local Reference**: The `.env` file at the repository root is used solely to maintain the variable map and facilitate environment configuration in the GitHub interface.
3.  **Privacy**: The local `.env` file is included in the root `.gitignore` to prevent accidental exposure in the repository.
4.  **OIDC Optimization**: Priority is given to OIDC use to eliminate dependence on static tokens (such as `JSR_TOKEN`) in GitHub Actions workflows.
5.  **Naming**: Platform-reserved prefixes (e.g., `GITHUB_`) are avoided to prevent collisions with internal CI system variables.
