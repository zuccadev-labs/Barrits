# 00 Indice de desarrollo de ts_js

Yo uso esta carpeta como punto de entrada para entender como esta construido el SDK `ts_js`, como se relacionan sus piezas y que reglas sigo para evolucionarlo sin romper su superficie publica.

Orden de lectura:

1. `01_arquitectura-de-carpetas.md`: yo explico como distribuyo codigo fuente, adapters, ejemplos, tests y artefactos.
2. `02_flujos-operativos.md`: yo describo como corren discovery, build, watch, consumo y validacion.
3. `03_dependencias-y-superficies.md`: yo documento que capa depende de cual y que subpaths publico.
4. `04_validacion-y-publicacion.md`: yo dejo el flujo de build, test, ejemplos y publicacion JSR/npm.
5. `05_descubrimiento-inspeccion-y-contratos.md`: yo explico discovery, inspection, manifests y snapshots como contratos internos.
6. `06_tooling-publicacion-y-plataformas.md`: yo documento bundlers, JSR, npm, Windows y validacion por plataforma.

Regla editorial:

- yo escribo esta documentacion en primera persona para dejar claro que decisiones tome y que criterio sigo al mantener el paquete
- yo separo desarrollo, investigacion y uso para no mezclar justificacion historica con operacion tecnica ni con onboarding de consumo
- yo uso el prefijo `00_`, `01_`, `02_` y asi sucesivamente para que el orden de lectura no dependa del explorador de archivos