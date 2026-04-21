# 01 Publicación y canales

La estrategia de distribución de `barrits` se apoya en dos canales públicos principales que garantizan la cobertura total de los escenarios de implementación actuales.

## Cobertura por Canal de Distribución

- **Registro npm**: Provee soporte para entornos Node.js y flujos de trabajo basados en bundlers, cubriendo integraciones para React, Vue, Solid, Svelte y aplicaciones de escritorio mediante Tauri.
- **Registro JSR**: Suministra una superficie nativa para entornos Deno, asegurando la portabilidad del SDK mediante la especificación `jsr.json`.

## Justificación Técnica de la Selección

La combinación de npm y JSR resulta suficiente para los objetivos actuales de la organización por los siguientes motivos:

- Las implementaciones de frontend y empaquetado (bundling) operan nativamente sobre el ecosistema Node.js (Vite, esbuild, Rollup, Webpack).
- El soporte para aplicaciones de escritorio (Tauri) depende directamente de las herramientas locales del ecosistema Node.js.
- El entorno Deno requiere una superficie de exportación optimizada y compatible con JSR para garantizar una experiencia de desarrollo fluida.

## Conclusión Operativa

Se determina que el alcance actual de npm y JSR cubre la totalidad de los recorridos visibles en los ejemplos de integración. No se considera necesaria la apertura de canales públicos adicionales por redundancia. En caso de requerir distribución privada o corporativa, se priorizará el uso de registros internos o mirrors antes que la adición de nuevos canales externos.

## Escenarios de Expansión Futura

Se evaluarán alternativas adicionales únicamente ante necesidades técnicas o de gobernanza específicas:

- **GitHub Packages**: Como canal intermedio de control corporativo o mirror interno.
- **Registros Privados**: Implementación de Artifactory o Verdaccio para distribución interna segura.
- **Canales de Prerelease**: Formalización de flujos "canary" o versiones beta bajo los registros existentes.
