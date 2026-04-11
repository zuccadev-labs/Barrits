# Documentacion de desarrollo

Yo uso esta carpeta para explicar como esta construido cada SDK, como fluyen sus contratos internos y como lo valido cuando hago cambios de arquitectura, tooling o publicacion.

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
- [ES/packages/ts_js/01_arquitectura-de-carpetas.md](ES/packages/ts_js/01_arquitectura-de-carpetas.md)
- [ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md](ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md)
- [ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md](ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md)

## Alcance de esta area

Aqui yo documento:

- arquitectura de carpetas
- flujos operativos
- dependencias y superficies publicas
- validacion y publicacion
- discovery, inspection, manifests y snapshots
- tooling por plataforma, bundlers y restricciones de distribucion

## Compatibilidad con documentos legacy

Los archivos legacy de esta area solo quedan como punteros:

- [monorepo-architecture.md](monorepo-architecture.md)

Yo no los trato como fuente principal de verdad; la fuente vigente es la estructura `ES/packages/<sdk>/`.