# 00 Indice de desarrollo de ts_js

Este documento sirve como punto de entrada para comprender la arquitectura del SDK `ts_js`, la relación entre sus componentes y las normas establecidas para su evolución sin comprometer la superficie pública.

## Orden de lectura recomendado

1.  **[01_arquitectura-de-carpetas.md](01_arquitectura-de-carpetas.md)**: Descripción de la distribución del código fuente, adaptadores, ejemplos, pruebas y artefactos.
2.  **[02_flujos-operativos.md](02_flujos-operativos.md)**: Detalle de los procesos de descubrimiento (discovery), construcción (build), monitoreo (watch), consumo y validación.
3.  **[03_dependencias-y-superficies.md](03_dependencias-y-superficies.md)**: Documentación de la jerarquía de dependencias y los subpaths publicados.
4.  **[04_validacion-y-publicacion.md](04_validacion-y-publicacion.md)**: Guía sobre el flujo de calidad y los procesos de publicación en JSR y npm.
5.  **[05_descubrimiento-inspeccion-y-contratos.md](05_descubrimiento-inspeccion-y-contratos.md)**: Explicación técnica de los contratos internos (manifests y snapshots).
6.  **[06_tooling-publicacion-y-plataformas.md](06_tooling-publicacion-y-plataformas.md)**: Documentación sobre compatibilidad con bundlers y validación multiplataforma.
7.  **[07_intencionalmente-saltado.md](07_intencionalmente-saltado.md)**: Número omitido intencionalmente — contenido absorbido por los documentos adyacentes 06 y 08.
8.  **[08_extension-fase1-examples.md](08_extension-fase1-examples.md)**: Plan de extensión de ejemplos del SDK a todos los runtimes (Deno, Bun, frameworks, bundlers).

## Estándares Editoriales Corporativos

- La documentación se redacta en tercera persona formal para mantener la objetividad técnica.
- Se mantienen segregadas las áreas de desarrollo, investigación y uso para evitar la mezcla de contextos históricos con guías operativas.
- Se utiliza una numeración prefijada (`00_`, `01_`, etc.) para garantizar un orden de lectura lógico e independiente del sistema de archivos.