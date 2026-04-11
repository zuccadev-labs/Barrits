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

Flujo recomendado:

1. yo cierro cambios en rama protegida
2. yo dejo CI, seguridad y validaciones relevantes en verde
3. yo actualizo `packages/sdk/ts_js/package.json`
4. yo actualizo `packages/sdk/ts_js/jsr.json`
5. yo creo un tag `vX.Y.Z`
6. yo ejecuto el workflow de release o publico desde el tag protegido

Regla de release:

- el tag del repo representa la release del SDK activo
- el tag `v0.1.0` representa la primera salida publica prevista
- el siguiente tag natural, si no rompo contrato ni agrego una capacidad de nivel minor, sera `v0.1.1`
- si en el futuro existen mas SDKs, convendra revisar si sigo con tag global o paso a tags por paquete

Mi postura actual:

- para este monorepo con un solo SDK activo, el tag global `vX.Y.Z` sigue siendo suficiente
- no necesito introducir `changesets` ni versionado independiente por paquete todavia

Licencia actual:

- por ahora publico bajo licencia `MIT`
- el reconocimiento autoral visible en los archivos de licencia actuales queda a nombre de `David Euclides Zuccarini Barrueta (devzucca / zuccadev)`
