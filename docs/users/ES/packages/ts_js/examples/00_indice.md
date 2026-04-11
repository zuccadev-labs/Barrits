# 00 Indice de ejemplos de ts_js

Yo uso esta carpeta para documentar los ejemplos ejecutables del SDK sin mezclar esa explicacion con la portada corta del paquete ni con los README locales de cada demo.

Orden de lectura:

1. `01_mapa-general.md`: yo explico como se organiza `packages/sdk/ts_js/examples/` y que cubre cada carpeta.
2. `02_nodejs-y-deno.md`: yo documento los recorridos de runtime puros para Node.js, Deno y Bun.
3. `03_frontend-vite.md`: yo documento los ejemplos frontend package-first con React, Vue, Solid y Svelte.
4. `04_bundlers.md`: yo explico cuando me conviene usar la carpeta `bundlers/` en vez de un ejemplo de runtime.
5. `05_tauri.md`: yo documento el ejemplo desktop seguro con backend Tauri y consumo resumido de manifests y snapshots.
6. `06_bun.md`: yo documento el recorrido Bun con foco en scripts `bun run` y APIs funcionales del paquete.

Regla de lectura:

- yo entro primero por esta carpeta si quiero entender que ejemplo me conviene abrir
- despues bajo al README local del ejemplo solo cuando ya se que flujo quiero ejecutar
- cuando quiero detalle de API vuelvo a `../09_referencia-de-api.md`
- el codigo fuente sigue siendo la referencia final de verdad operativa
