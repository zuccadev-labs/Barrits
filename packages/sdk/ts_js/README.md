# barrits

`barrits` es un SDK TypeScript y JavaScript con motor integrado de automatizacion.

Mi enfoque recomendado es package-first: yo configuro el proyecto consumidor y dejo que el SDK resuelva discovery, manifests, watch, readers y tooling cuando hace falta. La CLI sigue existiendo, pero la trato como fallback, diagnostico y automatizacion puntual.

## Instalacion

```bash
npm install barrits
```

## Inicio rapido

```ts
import { defineBarritsPackage } from "barrits";

export const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});
```

Si yo quiero defaults del proyecto, agrego `barrits.config.ts`:

```ts
import { defineBarritsConfig } from "barrits";

export default defineBarritsConfig({
  runtime: "react",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
```

## Superficies publicas

El paquete expone estas familias de entrada:

- `barrits`
- `barrits/node`
- `barrits/deno`
- `barrits/consume`
- `barrits/vite`
- `barrits/esbuild`
- `barrits/rollup`
- `barrits/webpack`
- `barrits/node/cli`
- `barrits/deno/cli`

## Ejemplos reales

Los recorridos reales del SDK viven en:

- `examples/example-nodejs/`
- `examples/example-deno/`
- `examples/example-react/`
- `examples/example-vue/`
- `examples/example-solid/`
- `examples/example-svelte/`
- `examples/example-tauri/`
- `examples/bundlers/`

## Documentacion oficial

La landing documental superior del monorepo vive en:

- [../../../docs/README.md](../../../docs/README.md)

Si yo quiero usar el SDK:

- [../../../docs/users/ES/packages/ts_js/00_indice.md](../../../docs/users/ES/packages/ts_js/00_indice.md)
- [../../../docs/users/ES/packages/ts_js/examples/00_indice.md](../../../docs/users/ES/packages/ts_js/examples/00_indice.md)
- [../../../docs/users/EN/packages/ts_js/00_index.md](../../../docs/users/EN/packages/ts_js/00_index.md)
- [../../../docs/users/EN/packages/ts_js/examples/00_index.md](../../../docs/users/EN/packages/ts_js/examples/00_index.md)
- [../../../docs/users/ES/packages/ts_js/05_automatizacion-y-configuracion.md](../../../docs/users/ES/packages/ts_js/05_automatizacion-y-configuracion.md)
- [../../../docs/users/ES/packages/ts_js/06_comandos-y-runtimes.md](../../../docs/users/ES/packages/ts_js/06_comandos-y-runtimes.md)
- [../../../docs/users/ES/packages/ts_js/07_manifests-bundlers-y-consumo.md](../../../docs/users/ES/packages/ts_js/07_manifests-bundlers-y-consumo.md)
- [../../../docs/users/ES/packages/ts_js/08_traits-y-composicion.md](../../../docs/users/ES/packages/ts_js/08_traits-y-composicion.md)

Si yo quiero mantener o extender el SDK:

- [../../../docs/development/ES/packages/ts_js/00_indice.md](../../../docs/development/ES/packages/ts_js/00_indice.md)
- [../../../docs/development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md](../../../docs/development/ES/packages/ts_js/05_descubrimiento-inspeccion-y-contratos.md)
- [../../../docs/development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md](../../../docs/development/ES/packages/ts_js/06_tooling-publicacion-y-plataformas.md)

Si yo quiero entender por que la arquitectura termino siendo asi:

- [../../../docs/investigations/ES/packages/ts_js/00_indice.md](../../../docs/investigations/ES/packages/ts_js/00_indice.md)

## Posicion de este README

Yo uso este `README` como portada publica y corta del paquete. El detalle normativo, operativo e historico vive en `docs/`, donde ya esta separado por uso, desarrollo e investigacion.