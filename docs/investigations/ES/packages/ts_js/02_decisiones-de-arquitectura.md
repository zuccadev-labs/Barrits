# 02 Decisiones de arquitectura de ts_js

Durante el proceso de investigación y prototipado del SDK, se evaluaron diversas estrategias de implementación. Las siguientes decisiones representan las conclusiones técnicas que rigen la arquitectura actual de `ts_js`.

## Decisión 1: Núcleo Portable y Aislamiento de Runtimes

Se optó por desarrollar un núcleo en TypeScript estrictamente portable, delegando los detalles específicos de ejecución a adaptadores (adapters). Esta separación permite que el mismo motor de orquestación sirva a ecosistemas Node.js y Deno sin duplicar la lógica de negocio principal.

## Decisión 2: Enfoque "Package-First"

Aunque se mantienen utilidades de línea de comandos para tareas de diagnóstico y automatización, la experiencia de integración prioritaria se define como "Package-First". El SDK está diseñado para ser consumido como una dependencia programática que orquesta el flujo de trabajo del desarrollador.

## Decisión 3: Encapsulamiento de `barrits_lib`

Se mantiene la librería `barrits_lib` como una biblioteca interna de soporte y algoritmos reusables. Sin embargo, su arquitectura es interna; el consumidor final interactúa exclusivamente con la superficie del SDK, protegiendo al usuario de la complejidad de la lógica de negocio subyacente.

## Decisión 4: Ejemplos como Proyectos Consumidores Reales

Se determinó que los ejemplos de integración deben funcionar como proyectos independientes. Esta decisión garantiza que los escenarios de uso validen fielmente la experiencia del desarrollador externo, evitando que se conviertan en meras demostraciones mezcladas con el código fuente del core.

## Decisión 5: Clasificación como SDK y no como Framework

Tras la transición a una estructura de monorepo, se seleccionó el término "SDK" como la convención correcta. El objetivo del proyecto es proporcionar una superficie de integración por lenguaje y runtime, y no imponer un stack tecnológico completo o cerrado.