# 05 Tauri

El ejemplo `packages/sdk/ts_js/examples/example-tauri/` demuestra el consumo seguro de manifests y snapshots en el contexto de una aplicación de escritorio multiplataforma.

## Objetivos de la implementación

La arquitectura de este ejemplo se centra en los siguientes pilares de seguridad y rendimiento:

- **Aislamiento del Renderer**: Se garantiza que la lectura directa de artefactos del sistema de archivos ocurra exclusivamente fuera del contexto del navegador (renderer).
- **Validación de Rutas en Backend**: El backend de Tauri actúa como gatekeeper, validando los permisos de acceso antes de procesar cualquier archivo.
- **Resumen de Artefactos**: Se utiliza el subpath `@zuccadev-labs/barrits/consume` para transformar manifests complejos en estructuras ligeras aptas para el bridge de comunicación.
- **Gobernanza de Datos**: El frontend recibe únicamente los payloads necesarios para la interfaz de usuario, eliminando el acceso libre o indiscriminado al filesystem.

## Comandos operativos

```bash
# Desarrollo del frontend y del backend Tauri
npm run dev
npm run tauri:dev

# Generación del binario e instalador
npm run build
npm run tauri:build
```

## Flujo de orquestación seguro

1. El **Frontend** solicita al backend de Tauri el estado de un manifest o snapshot específico.
2. El **Backend** intercepta la petición y valida que la ruta se encuentre dentro de los directorios permitidos por la política de seguridad.
3. El **Backend** procesa el archivo utilizando los lectores especializados del SDK.
4. El **Renderer** recibe los datos controlados y procesados, manteniendo la integridad del sistema operativo protegida.

Este ejemplo es la referencia técnica recomendada para escenarios que involucren seguridad de escritorio y la implementación de backends locales controlados.