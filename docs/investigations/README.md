# Documentacion de investigacion

Yo uso esta carpeta para registrar por que llegue a la arquitectura actual, que problemas estaba resolviendo y que decisiones sobrevivieron al proceso de diseño.

## Como leo esta area

Mi recorrido recomendado es este:

1. yo elijo idioma
2. yo elijo familia, por ejemplo `packages`
3. yo entro al SDK concreto
4. yo sigo el orden `00_`, `01_`, `02_` y asi sucesivamente

## Punto de entrada actual

### ES

#### packages

##### ts_js

- [ES/packages/ts_js/00_indice.md](ES/packages/ts_js/00_indice.md)
- [ES/packages/ts_js/01_proposito-y-problema.md](ES/packages/ts_js/01_proposito-y-problema.md)
- [ES/packages/ts_js/03_camino-hacia-el-monorepo.md](ES/packages/ts_js/03_camino-hacia-el-monorepo.md)
- [ES/packages/ts_js/04_conclusiones-y-limites.md](ES/packages/ts_js/04_conclusiones-y-limites.md)

## Alcance de esta area

Aqui yo documento:

- proposito inicial
- problema de diseño
- decisiones de arquitectura
- recorrido hacia el monorepo
- conclusiones activas y limites asumidos

## Compatibilidad con documentos legacy

El archivo legacy de esta area solo queda como puntero:

- [2026-04-06-barrits-arquitectura-funcional.md](2026-04-06-barrits-arquitectura-funcional.md)

Yo no lo trato como fuente principal de verdad; la fuente vigente es la estructura `ES/packages/<sdk>/`.