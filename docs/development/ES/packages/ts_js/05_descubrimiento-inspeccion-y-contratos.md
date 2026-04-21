# 05 Descubrimiento, inspección y contratos de ts_js

Los subsistemas de descubrimiento (discovery), inspección (inspection), manifests y snapshots operan como un ecosistema unificado. Cada adaptador o plugin de construcción consume el mismo contrato operativo para garantizar la coherencia del comportamiento independientemente del entorno.

## Filosofía del Flujo de Descubrimiento

La localización del directorio de dominio `barrits/` sigue un orden de resolución determinista para evitar ambigüedades:

1.  **Contexto Actual**: Se valida si la ruta de ejecución ya se encuentra dentro de `barrits/`.
2.  **Contención Inmediata**: Se verifica si el directorio actual contiene una carpeta `barrits/`.
3.  **Jerarquía Ascendente**: Se inspeccionan los directorios superiores en busca de la carpeta de dominio.
4.  **Búsqueda Prospectiva**: En ausencia de coincidencias previas, se realiza una búsqueda descendente con profundidad controlada.

## Metodología de Inspección y Análisis

Las herramientas de análisis (`info` e `inspectBarritsIntegrations()`) consolidan el estado real del proyecto consumidor para proyectar un grafo técnico detallado que incluye:

- Estructura de dominios y archivos.
- Definición de barrels y exportaciones públicas.
- Metadatos de visibilidad y tipos de archivos.
- Acciones de importación gestionadas.
- Metodología declarativa de **Traits** y sus respectivos diagnósticos técnicos.

El sistema permite aplicar filtros sobre este grafo (por dominio, visibilidad o tipo de exportación) para realizar inspecciones quirúrgicas sin necesidad de modificar el motor central.

## Gestión de Traits y Diagnósticos de Integridad

Cuando la fase de inspección detecta metadatos declarativos de Traits, la información se procesa para su consumo tanto en interfaces humanas como en contratos serializados (JSON). El reporte de integridad incluye:

- Descriptores de Traits detectados.
- Análisis de desviación (drift) entre la documentación JSDoc y el contrato en tiempo de ejecución.
- Clasificación de errores en categorías operativas: `drift`, `impossible` y `non-verifiable`.

## Estándares de Documentación y Contratos JSDoc

La superficie pública y los contratos de Traits se documentan siguiendo estrictas normas de JSDoc para asegurar una semántica estable. Las reglas obligatorias incluyen la declaración de propósito, parámetros, retornos y excepciones mediante `@throws`.

### Tags Declarativos de Barrits

Se emplean etiquetas especializadas para la orquestación, tales como `@barrits-trait`, `@barrits-requires`, `@barrits-provides`, entre otros, asegurando que la normalización de estos metadatos sea resistente a cambios de formato.

## Gobernanza de Contratos Operativos

El sistema mantiene dos proyecciones principales para el tooling externo:

- **`build-manifest.json`**: Orientado a pipelines de compilación y empaquetado.
- **`watch-snapshot.json`**: Diseñado para herramientas complementarias en entornos de desarrollo activo.

Esta arquitectura asegura que el motor integrado mantenga la fuente de verdad del grafo, mientras que las herramientas externas consumen proyecciones serializadas, eliminando la necesidad de que los consumidores finales implementen lógica interna de descubrimiento.