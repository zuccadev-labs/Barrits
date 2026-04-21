# Changelog

Todos los cambios relevantes de este repositorio se documentan aqui.

El formato sigue la idea de Keep a Changelog y el versionado esperado del SDK activo sigue SemVer.

## [0.1.2] - 2026-04-20

### Added
- **Industrialización de Lógica Core**: Delegación de la normalización de configuración a servicios internos (`config_normalization.ts`) bajo SRP.
- **Mesh Documental Enterprise**: Unificación bilingüe (ES/EN) en todos los dominios (`users`, `development`, `investigations`, `package`).
- **Certificación de Tono Corporativo**: Cumplimiento del 100% en tono formal de tercera persona en toda la suite documental.
- **Esquema de Configuración Experto**: Adición de referencia completa de propiedades y recomendaciones arquitectónicas para `barrits.config.ts`.
- **Patrones de Integración Avanzada**: Documentación de estrategias de aislamiento en Monorepos, Inyección de Dependencias y gobernanza de CI/CD.
- **Seguridad e Integridad**: Corrección de `ignoreDeprecations` en `tsconfig.json` y aseguramiento de estructuras de manifiesto preparadas para checksums.

## [0.1.1] - 2026-04-20

### Added

- Aprobación al 100% de la versión Release. Evolución estable desde la ruta de pre-releases (rc.4), implementando Orquestación, Clean Code y SRP.

## [0.1.0-rc.4] - 2026-04-20

### Added in 0.1.0-rc.4

- **AST Incremental Caching a 0ms**: Eliminación absoluta del cuello de botella en recolección de metadatos para proyectos en watch/build modes.
- **Desacoplamiento SRP Estricto**: División del monolito `inspect.ts` en dominios ultra-especializados (`ast/cache`, `ast/extractor`, `ast/traits`, `graph/collisions`).
- **Data Contract Checksums**: Integración de sellos de seguridad hash transaccionales en `BuildManifest` para repeler degeneración estructural del código.
- **Auditoría Multi-Lenguaje**: Preparación de librerías utilitarias internas (como lógica y matemáticas) mantenibles bajo un patrón *Core vs Lib*, sirviendo como fundamentos extensibles para nuevos lenguajes y constructos.

### Changed in 0.1.0-rc.4

- Posicionamiento documental del `README.md` hacia benchmarking evolutivo analítico evitando destrucción de librerías hermanas.
- Normalización formal de API de consumo.

## [0.1.0-rc.1] - 2026-04-11

### Added in 0.1.0-rc.1

- flujo formal de ramas `feature/* -> dev -> main` con proteccion y PR obligatorios para promociones
- soporte de prereleases mediante tags `pre-vX.Y.Z-rc.N` con publicacion diferenciada para npm y JSR
- GitHub Release automatica para prereleases y releases estables

### Changed in 0.1.0-rc.1

- CI y Security ahora validan `dev` y `main` tanto en push como en pull request
- release workflow valida la rama objetivo del tag y el versionado sincronizado entre npm y JSR
- actualizacion del toolchain y de las dependencias directas del monorepo a las ultimas versiones compatibles verificadas

### Fixed in 0.1.0-rc.1

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
