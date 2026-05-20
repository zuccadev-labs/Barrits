---
title: "04 Buenas prácticas de ts_js"
description: "Corporate documentation for 04 Buenas prácticas de ts_js."
---

# 04 Buenas prácticas de ts_js

Estas prácticas mantienen el contrato package-first y previenen el drift de integración más frecuente.

## Convenciones fundamentales

1. Mantener visible únicamente la carpeta `barrits/` en el proyecto consumidor como límite de dominio declarado.
2. No exponer `barrits_lib` como contrato público del proyecto consumidor — es la librería base interna del SDK.
3. Preferir la declaración de configuración antes que encadenar comandos manuales.
4. Usar los ejemplos del repositorio como referencia autoritativa de integración por runtime.
5. Validar los cambios contra el ejemplo que cubre la superficie afectada.

## Dependencias externas

El criterio de decisión es la capa del runtime, no preferencias de estilo:

- Si el módulo es específico de Node, las dependencias de Node son aceptables.
- Si el módulo es específico de Deno, las dependencias compatibles con Deno son aceptables.
- Si el módulo es frontend, las dependencias del browser o del framework son aceptables.

Las dependencias específicas de runtime pertenecen a la capa del adapter de runtime, no al código compartido o universal.

## Importaciones

Barrits resuelve desde la raíz del proyecto consumidor. No se requiere ninguna "carpeta mágica" — aplica la resolución estándar de módulos del proyecto o workspace. Importar desde el subpath público correcto es suficiente.

## Patrones a evitar

Las siguientes decisiones rompen la experiencia package-first:

- Ocultar la configuración detrás de scripts ad-hoc sin `defineBarritsPackage()` ni `defineBarritsConfig()`.
- Mezclar código específico de runtime dentro de la capa de paquete reutilizable.
- Usar un ejemplo de frontend como referencia para integraciones Node o Deno.
- Importar desde rutas `dist/` directamente cuando existe un subpath público disponible.

## Uso de ejemplos

Se debe identificar la experiencia necesaria primero y luego seleccionar únicamente el ejemplo que cubre esa superficie específica. Copiar ejemplos completos sin adaptarlos al runtime y a la forma real del proyecto introduce acoplamiento difícil de mantener.

## Documentar nuevas capacidades

Al agregar una nueva capacidad, se debe documentar:

- Qué runtime cubre.
- Qué ejemplo la demuestra.
- Qué subpath o función de API pública la expone.
- Qué validación mínima se requiere para confiar en ella.