# 04 Buenas practicas de ts_js

Yo sigo estas practicas para que `barrits` me ayude y no se convierta en otra fuente de drift.

## Practicas que sigo siempre

1. yo mantengo visible solo la carpeta `barrits/` en el consumidor
2. yo no expongo `barrits_lib` como contrato publico del proyecto consumidor
3. yo prefiero configurar el paquete antes que encadenar comandos manuales
4. yo uso los ejemplos del repo como referencia de implementacion real por runtime
5. yo valido mis cambios con el ejemplo que cubre la superficie que toque

## Como trato dependencias externas

Yo no uso una lista blanca artificial de dependencias “permitidas”. Yo decido segun runtime:

- si el modulo es de Node, acepto dependencias de Node
- si el modulo es de Deno, acepto dependencias compatibles con Deno
- si el modulo es frontend, acepto dependencias del browser o del framework

Mi restriccion real no es moral ni estetica; es arquitectonica. Si una dependencia es especifica de runtime, la dejo en la capa de ese runtime y no la trato como codigo universal.

## Como pienso las importaciones

Si el proyecto tiene resuelta la dependencia, yo puedo importar `barrits` desde cualquier archivo del arbol del proyecto. No dependo de una carpeta “magica”; dependo de la resolucion normal de modulos del proyecto o workspace.

## Practicas que evito

Yo evito estas decisiones porque me rompen la experiencia package-first:

- esconder la configuracion en scripts ad hoc sin `defineBarritsPackage()` ni `defineBarritsConfig()`
- mezclar runtime-specific code dentro de la parte reusable del paquete
- tomar un ejemplo de frontend y usarlo como si fuera referencia para Node o Deno
- depender de rutas temporales de `dist/` cuando existe un subpath publico del paquete

## Como pienso los ejemplos

Yo no copio un ejemplo completo por reflejo. Yo primero identifico la experiencia que quiero y luego tomo solo el ejemplo que cubre esa superficie.

## Como mantengo la claridad

Cuando yo agrego una capacidad nueva, tambien documento:

- que runtime cubre
- que ejemplo la demuestra
- que subpath o API publica la expone
- que validacion minima necesito para confiar en ella