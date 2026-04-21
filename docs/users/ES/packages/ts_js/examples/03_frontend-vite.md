# 03 Frontend Vite

Los ejemplos `example-react/`, `example-vue/`, `example-solid/` y `example-svelte/` conforman una familia documental unificada, ya que todos validan el contrato **package-first** sobre el ecosistema de Vite.

## Objetivos de integración comunes

En todos estos escenarios se valida la misma superficie funcional:

- Instalación y resolución del paquete `@zuccadev-labs/barrits`.
- Definición del paquete consumidor mediante `defineBarritsPackage()`.
- Integración del plugin oficial `@zuccadev-labs/barrits/vite`.
- Generación automática de artefactos (manifests virtuales) sin requerir comandos manuales externos al flujo de desarrollo del bundler.

## Estrategias de simplificación

- Se eliminan los re-exports manuales complejos y barrels redundantes.
- El motor de Barrits detecta automáticamente los métodos públicos desde el árbol de archivos declarado por el consumidor.
- Los métodos que deben permanecer como privados se declaran en `barrits.config.ts` bajo el campo `contracts.exports`.

## Matices técnicos por ejemplo

- **`example-react/`**: Provee el recorrido base de integración del plugin con el stack de React.
- **`example-vue/`**: Valida el mismo contrato, enfocándose en la capacidad de discovery bajo la ruta `src/barrits/` común en proyectos Vue.
- **`example-solid/`**: Extiende la validación al ecosistema Solid para garantizar la neutralidad del contrato.
- **`example-svelte/`**: Cierra la cobertura de frameworks principales bajo el mismo patrón de consumo.

## Comandos operativos

Estos ejemplos operan bajo los comandos estándar del ecosistema:

- `npm run dev`: Inicia el modo desarrollo con watch automático del motor de orquestación.
- `npm run build`: Genera el bundle final materializando los manifests de producción.

## Selección del ejemplo de referencia

- Se recomienda consultar el ejemplo de **React** para comprender el caso de uso base más directo.
- El ejemplo de **Vue** es la referencia adecuada para revisar la flexibilidad del discovery bajo subdirectorios específicos.
- Los ejemplos de **Solid** o **Svelte** sirven para auditar que el contrato arquitectónico no presenta acoplamiento con una librería de UI específica.

Para la revisión exhaustiva de plugins de build fuera del flujo de una aplicación frontend, se debe consultar la carpeta especializada `bundlers/`.