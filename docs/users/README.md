# Documentacion de uso

Yo uso esta carpeta para documentar como instalo, configuro y consumo cada SDK del monorepo desde la perspectiva de quien lo usa.

## Como leo esta area

Mi recorrido recomendado es este:

1. yo elijo idioma
2. yo elijo familia de artefacto, por ejemplo `packages`
3. yo entro al SDK concreto
4. yo sigo el orden `00_`, `01_`, `02_` y asi sucesivamente

## Punto de entrada actual

### ES

#### packages

##### ts_js

- [ES/packages/ts_js/00_indice.md](ES/packages/ts_js/00_indice.md)
- [ES/packages/ts_js/01_instalacion.md](ES/packages/ts_js/01_instalacion.md)
- [ES/packages/ts_js/03_ejemplos-y-recorridos.md](ES/packages/ts_js/03_ejemplos-y-recorridos.md)
- [ES/packages/ts_js/examples/00_indice.md](ES/packages/ts_js/examples/00_indice.md)
- [ES/packages/ts_js/05_automatizacion-y-configuracion.md](ES/packages/ts_js/05_automatizacion-y-configuracion.md)

## Alcance de esta area

Aqui yo documento:

- instalacion
- primeros pasos
- ejemplos reales de consumo

- buenas practicas
- automatizacion y configuracion visible al usuario
- comandos y runtimes como fallback operativo
- manifests, bundlers y helpers de consumo
- traits y composicion desde el punto de vista de uso

## Regla editorial

Yo no mezclo aqui decisiones historicas ni detalles internos de mantenimiento. Si necesito eso, salto a `../investigations/README.md` o `../development/README.md`.
