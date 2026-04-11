# example-tauri

Yo uso este ejemplo cuando necesito mostrar una politica de consumo segura: el renderer no toca el filesystem directo, el backend controla las rutas permitidas y solo devuelve payloads resumidos a la UI.

## Para que sirve

- demuestra un patron seguro para desktop
- enseña cuando conviene usar `@zuccadev-labs/barrits/consume` en vez de inyectar manifests virtuales al frontend
- separa claramente renderer, backend y artifacts del proyecto

## Que archivos mirar primero

- `src/main.ts`: UI que invoca al backend y muestra summaries
- `src-tauri/src/main.rs`: backend Tauri que controla la lectura de archivos
- `src/barrits/` o artifacts del proyecto: origen de los datos resumidos

## APIs que este ejemplo usa

- `readBuildManifestSummary`: lee y resume el manifest sin exponer el archivo crudo al renderer
- `readLanguageToolSnapshot`: lee el snapshot de tooling de lenguaje de forma controlada
- tipos `BarritsConsumedStateSummary` y `BarritsLanguageToolSnapshot`: tipan el payload que llega a la UI

## Como leerlo

Primero miro `src/main.ts` para entender el contrato entre UI y backend.

Despues reviso `src-tauri/src/main.rs` para ver como se restringe el acceso al filesystem.

La semantica exacta de los readers vive en [../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md](../../../../../docs/users/ES/packages/ts_js/09_referencia-de-api.md).

## Comandos utiles

- `npm run dev`: entorno web del ejemplo
- `npm run build`: build web del ejemplo
- `npm run tauri:dev`: app desktop en desarrollo
- `npm run tauri:build`: build desktop final
