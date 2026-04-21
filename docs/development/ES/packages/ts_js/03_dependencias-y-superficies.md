# 03 Dependencias y superficies de ts_js

El diseño del SDK se rige por un principio fundamental: mantener la portabilidad del núcleo (core) y evitar que las particularidades tecnológicas de cada runtime contaminen la superficie universal de la API.

## Gobernanza de Dependencias

Se aplican criterios diferenciados de aceptación de dependencias según la capa del sistema:

- **Capa Core**: Prioriza componentes con alta portabilidad y mínima huella de dependencias.
- **Adaptadores de Runtime**: Aceptan dependencias específicas del entorno correspondiente (ej. Node.js o Deno).
- **Entornos de Ejemplo**: Pueden incorporar dependencias de frameworks de UI o herramientas de construcción específicas.

## Distribución de Superficies Públicas

El SDK publica y mantiene los siguientes puntos de entrada oficiales:

- **`@zuccadev-labs/barrits`**: Superficie operativa principal de la plataforma.
- **Superficies de Entorno**: Adaptadores especializados para Node.js y Deno.
- **Capas de Construcción**: Plugins integrados para Vite, esbuild, Rollup y Webpack.
- **Capa de Consumo**: Herramientas de lectura segura para manifests y snapshots.
- **Interfaces Operativas**: Puntos de entrada para las interfaces de línea de comandos (CLI).

## Restricciones Arquitectónicas de Dependencia

Para preservar la integridad del diseño, se establecen las siguientes prohibiciones:

1.  Los componentes compartidos (`shared`) no deben depender de dominios de negocio específicos.
2.  Los detalles técnicos de ejecución no deben integrarse en la capa puramente técnica y reusable del core.
3.  Los ejemplos de uso no pueden actuar como dependencias ascendentes del núcleo operativo.
4.  La librería interna de soporte (`barrits_lib`) no debe exponerse como parte de la arquitectura visible del consumidor final.

## Validación del Ecosistema

Cada ejemplo de integración depende exclusivamente del paquete local configurado mediante workspaces. Este método permite validar el flujo real del desarrollador y elimina la necesidad de mantener configuraciones duplicadas en el repositorio.