# Documentacion de barr&tis

Yo uso esta carpeta como landing documental superior del monorepo. Aqui separo la documentacion por area y por SDK para que no se mezcle uso, mantenimiento tecnico y contexto historico.

## Como esta organizada

Las areas actuales son estas:

- `users/`: yo documento instalacion, uso, ejemplos y buenas practicas
- `development/`: yo documento arquitectura interna, flujos, contratos y validacion tecnica
- `investigations/`: yo documento por que llegue a la arquitectura actual y que decisiones la explican
- `package/`: yo documento publicacion, versionado, secrets, variables y gobierno operativo de releases

Las landings intermedias de area viven en:

- [users/README.md](users/README.md)
- [development/README.md](development/README.md)
- [investigations/README.md](investigations/README.md)
- [package/README.md](package/README.md)

La estructura objetivo por idioma y SDK es esta:

```txt
/docs
  /users
    /ES
      /packages
        /ts_js
    /EN
      /packages
        /ts_js
  /development
    /ES
      /packages
        /ts_js
  /investigations
    /ES
      /packages
        /ts_js
```

## Punto de entrada por SDK

### ts_js

Este SDK corresponde a `barrits` para TypeScript y JavaScript.

Si yo quiero usarlo:

- [users/ES/packages/ts_js/00_indice.md](users/ES/packages/ts_js/00_indice.md)
- [users/ES/packages/ts_js/03_ejemplos-y-recorridos.md](users/ES/packages/ts_js/03_ejemplos-y-recorridos.md)
- [users/ES/packages/ts_js/examples/00_indice.md](users/ES/packages/ts_js/examples/00_indice.md)
- [users/EN/packages/ts_js/00_index.md](users/EN/packages/ts_js/00_index.md)
- [users/EN/packages/ts_js/examples/00_index.md](users/EN/packages/ts_js/examples/00_index.md)
- [users/ES/packages/ts_js/05_automatizacion-y-configuracion.md](users/ES/packages/ts_js/05_automatizacion-y-configuracion.md)

Si yo quiero mantenerlo o extenderlo:

- [development/ES/packages/ts_js/00_indice.md](development/ES/packages/ts_js/00_indice.md)
- [development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md](development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md)
- [development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md](development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md)

Si yo quiero entender su recorrido arquitectonico:

- [investigations/ES/packages/ts_js/00_indice.md](investigations/ES/packages/ts_js/00_indice.md)
- [investigations/ES/packages/ts_js/03_camino-hacia-el-monorepo.md](investigations/ES/packages/ts_js/03_camino-hacia-el-monorepo.md)

## Como leo la documentacion

Mi regla de lectura es simple:

1. yo entro por `docs/README.md`
2. yo elijo area segun mi necesidad
3. yo entro a la landing intermedia de esa area
4. yo bajo al idioma y despues al SDK
5. yo sigo el orden numerado `00_`, `01_`, `02_` y asi sucesivamente

## Regla editorial

Yo mantengo esta landing corta y transversal. No duplico aqui el contenido detallado de cada area; solo dejo rutas claras de entrada y el mapa estable del sistema documental.