# 02 Versionado y releases

Yo recomiendo una estrategia simple y defendible basada en SemVer.

Regla base:

- `MAJOR`: cuando rompo contrato publico o cambio recorridos de consumo de forma incompatible
- `MINOR`: cuando agrego capacidades compatibles, nuevos adapters o mejoras visibles
- `PATCH`: cuando corrijo bugs, hardening, validaciones o detalles de tooling sin romper contrato

Version unica del SDK actual:

- hoy `npm` y `JSR` deben salir con la misma version del SDK `barrits`
- no separo versiones por canal mientras ambos representen la misma release funcional
- la primera publicacion objetivo es `0.1.0`
- despues sigo con `0.1.1`, `0.1.2` y asi sucesivamente mientras los cambios sigan siendo compatibles y de nivel patch

Ramas operativas:

- `dev` concentra integracion y prereleases
- `main` concentra releases estables
- cualquier rama de trabajo entra por PR a `dev`
- la promocion de `dev` a `main` tambien pasa por PR

Flujo recomendado:

1. yo cierro cambios en una rama de trabajo
2. yo abro PR hacia `dev`
3. yo dejo CI, seguridad y validaciones relevantes en verde
4. si necesito una salida de prueba, actualizo `packages/sdk/ts_js/package.json` y `packages/sdk/ts_js/jsr.json` a una version prerelease, por ejemplo `0.2.0-rc.1`
5. yo creo el tag `pre-v0.2.0-rc.1` sobre `dev`
6. el workflow publica prerelease en npm con dist-tag `next`, publica en JSR y crea GitHub prerelease
7. cuando la integracion queda aprobada, abro PR de `dev` hacia `main`
8. actualizo ambas versiones a la salida estable, por ejemplo `0.2.0`
9. yo creo el tag `v0.2.0` sobre `main`
10. el workflow publica release estable en npm y JSR y crea GitHub Release

Regla de release:

- el tag del repo representa la release del SDK activo
- el tag `pre-v0.2.0-rc.1` representa una salida prerelease desde `dev`
- el tag `v0.1.0` representa una salida estable desde `main`
- el siguiente tag natural, si no rompo contrato ni agrego una capacidad de nivel minor, sera `v0.1.1` o la prerelease que corresponda antes de esa salida
- si en el futuro existen mas SDKs, convendra revisar si sigo con tag global o paso a tags por paquete

Mi postura actual:

- para este monorepo con un solo SDK activo, el tag global `vX.Y.Z` sigue siendo suficiente
- para prereleases, agrego el prefijo de canal `pre-v` y mantengo el SemVer prerelease en la version del paquete
- no necesito introducir `changesets` ni versionado independiente por paquete todavia

Licencia actual:

- por ahora publico bajo licencia `MIT`
- el reconocimiento autoral visible en los archivos de licencia actuales queda a nombre de `David Euclides Zuccarini Barrueta (devzucca / zuccadev)`
