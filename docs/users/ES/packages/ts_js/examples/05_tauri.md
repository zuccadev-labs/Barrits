# 05 Tauri

Yo uso `packages/sdk/ts_js/examples/example-tauri/` cuando necesito demostrar consumo seguro de manifests y snapshots desde una aplicacion desktop.

Objetivo del ejemplo:

- mantener la lectura de artifacts fuera del renderer
- validar rutas desde el backend Tauri
- reutilizar `@zuccadev-labs/barrits/consume` para resumir manifests y snapshots
- entregar al frontend solo payloads aptos para UI

Comandos disponibles:

- `npm run dev`
- `npm run build`
- `npm run tauri:dev`
- `npm run tauri:build`

Flujo que yo documento con este ejemplo:

1. el frontend pide al backend Tauri un manifest o snapshot
2. el backend valida la ruta permitida
3. el backend lee el archivo y usa lectores resumidos del paquete
4. el renderer recibe solo datos controlados, no acceso libre al filesystem

Este ejemplo no reemplaza a los de Vite. Yo lo uso cuando la pregunta ya no es solo frontend package-first, sino seguridad de escritorio y backend local controlado.