# Changelog

Todos los cambios relevantes de este repositorio se documentan aqui.

El formato sigue la idea de Keep a Changelog y el versionado esperado del SDK activo sigue SemVer.

## [0.1.0-rc.1] - 2026-04-11

### Added

- flujo formal de ramas `feature/* -> dev -> main` con proteccion y PR obligatorios para promociones
- soporte de prereleases mediante tags `pre-vX.Y.Z-rc.N` con publicacion diferenciada para npm y JSR
- GitHub Release automatica para prereleases y releases estables

### Changed

- CI y Security ahora validan `dev` y `main` tanto en push como en pull request
- release workflow valida la rama objetivo del tag y el versionado sincronizado entre npm y JSR
- actualizacion del toolchain y de las dependencias directas del monorepo a las ultimas versiones compatibles verificadas

### Fixed

- fallback limpio para `dependency-review` cuando GitHub no tiene dependency graph habilitado en el repositorio
- sincronizacion del pipeline de publicacion con `npm 11.6.2`, version validada para este grafo de dependencias

## [0.1.0] - 2026-04-10

### Added

- conversion del repo a monorepo coordinado desde raiz con `packages/sdk/ts_js`
- ejemplos reales reubicados bajo `packages/sdk/ts_js/examples`
- documentacion estructurada por `users`, `development`, `investigations` y `package`
- guias de publicacion, versionado, secretos y variables en `docs/package`
- workflows de GitHub Actions para CI, seguridad y release
- politicas base de seguridad en `SECURITY.md`
- licencia MIT para raiz y SDK activo

### Changed

- posicionamiento del repositorio como `sdk` y no `framework`
- README raiz y README del paquete alineados con publicacion corporativa y navegacion documental
- endurecimiento del `.gitignore` para artefactos reales de Node.js, Deno, bundlers y Tauri

### Fixed

- rutas de ejemplos y workspaces tras la migracion al monorepo
- cobertura documental de ejemplos con indices oficiales en ES y EN
- preparacion de release para npm y JSR con secrets y environments diferenciados
