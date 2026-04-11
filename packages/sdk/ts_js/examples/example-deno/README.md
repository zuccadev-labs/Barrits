# example-deno

Yo uso este ejemplo cuando quiero validar que el mismo SDK funciona bien en Deno o JSR sin depender del adapter Node.

## Para que sirve

- demuestra que el flujo package-first tambien existe fuera de Node.js
- deja un punto de referencia minimo para `deno task`
- muestra que el paquete puede mezclar configuracion y algoritmos en el mismo runtime

## Que archivos mirar primero

- `main.ts`: recorrido base del runtime Deno
- `barrits/`: capa visible del consumidor dentro del ejemplo
- `scripts/`: tareas auxiliares del ejemplo si necesito revisar automatizacion
- `deno.json`: comandos oficiales del recorrido

## APIs que este ejemplo usa de forma explicita

- `defineBarritsPackage`: describe el consumidor Deno
- `movingAverage`: calcula una media movil simple sobre throughput
- `averageBy`: resume el promedio general
- `topK`: selecciona valores criticos del conjunto

## Como leerlo

Si yo quiero confirmar compatibilidad JSR o Deno, este es el primer ejemplo que abro porque reduce el ruido del frontend y de los bundlers.

Si despues necesito lectura de artifacts o integracion CLI, salto a `06_comandos-y-runtimes.md` y a la referencia de [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `deno task dev`: ejecucion base del recorrido
- `deno task build`: build del consumidor usando el adapter Deno
- `deno task inspect`: inspeccion del proyecto desde el runtime
