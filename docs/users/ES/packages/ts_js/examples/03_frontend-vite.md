# 03 Frontend Vite

Yo trato `example-react/`, `example-vue/`, `example-solid/` y `example-svelte/` como la misma familia documental porque todos prueban el contrato package-first sobre Vite.

## Objetivo comun

En los cuatro casos yo valido lo mismo:

- instalacion del paquete `@zuccadev-labs/barrits`
- definicion del paquete consumidor con `defineBarritsPackage()`
- uso de `@zuccadev-labs/barrits/vite`
- generacion automatica del manifest virtual sin pedir comandos manuales del motor

## Diferencias utiles

- `example-react/`: recorrido base del plugin Vite con React.
- `example-vue/`: mismo contrato, pero demostrando discovery en `src/barrits/` dentro de Vue.
- `example-solid/`: misma idea sobre Solid para cerrar otra variante real del ecosistema Vite.
- `example-svelte/`: misma cobertura visible sobre Svelte.

## Comandos que yo espero

En estos ejemplos uso los mismos dos comandos base:

- `npm run dev`
- `npm run build`

## Cuando abro cada ejemplo

- yo abro React si quiero el caso frontend base mas directo
- yo abro Vue si quiero revisar discovery bajo `src/barrits/`
- yo abro Solid o Svelte si quiero comprobar que el contrato no esta acoplado a un solo framework

Si lo que necesito es revisar plugins de build fuera del flujo de una app frontend, uso la carpeta `bundlers/`.