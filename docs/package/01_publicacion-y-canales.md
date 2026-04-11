# 01 Publicacion y canales

Hoy yo no necesito un tercer registro publico para cubrir los ejemplos actuales.

Cobertura real por canal:

- `npm`: cubre `example-nodejs`, `example-react`, `example-vue`, `example-solid`, `example-svelte`, `bundlers` y `example-tauri`.
- `JSR`: cubre `example-deno` y la superficie Deno publicada del SDK.

Por que eso alcanza hoy:

- los ejemplos frontend y bundlers corren sobre Vite, esbuild, Rollup o Webpack en ecosistema Node.js
- el ejemplo Tauri tambien depende del ecosistema Node.js para frontend y tooling local
- el ejemplo Deno necesita una superficie Deno-native, y para eso ya existe `jsr.json`

Mi conclusion operativa es esta:

- con `npm` y `JSR` cubro todos los recorridos visibles de los ejemplos actuales
- no necesito publicar en otro registro publico solo por redundancia
- si la corporacion necesita distribucion interna, prefiero un mirror o registry interno antes que sumar otro canal publico

Opciones que yo consideraria solo si aparece una necesidad real:

- GitHub Packages como mirror interno o intermedio de control corporativo
- Artifactory, Verdaccio o un registry interno si la organizacion no quiere depender de publicacion publica directa
- un canal canary o prerelease, pero sin abrir un tercer registro distinto
