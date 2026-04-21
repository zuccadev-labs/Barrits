# 04 Variables de entorno

El archivo `.env` se organiza estrictamente por entornos de ejecución, empleando comentarios descriptivos para garantizar que actúe como un mapa de referencia coherente y no como una lista desordenada de conceptos.

## Mapa de Variables de Referencia

A continuación se detallan las variables empleadas en la orquestación del repositorio:

- **`NPM_TOKEN_PUBLICAR_NPM`**: Opcional. Empleada para compatibilidad en la publicación inicial de npm si no se dispone de "Trusted Publishing".
- **`ENTORNO_PUBLICAR_NPM`**: Nombre del entorno de GitHub configurado para el canal npm.
- **`ENTORNO_PUBLICAR_JSR`**: Nombre del entorno de GitHub configurado para el canal JSR.
- **`RUTA_PAQUETE_PUBLICAR_NODE`**: Ruta relativa del paquete npm dentro de la estructura de monorepo.
- **`RUTA_CONFIG_PUBLICAR_JSR`**: Ruta al archivo `jsr.json` que rige la publicación en Deno.
- **`TAG_VERSION_PUBLICAR`**: Identificador del tag esperado para la release (ej. `v0.1.0`).
- **`RAMA_PROTEGIDA_INTEGRAR`**: Definición de la rama de producción protegida (ej. `main`).

## Normas de Uso y Seguridad

Para preservar el cumplimiento de los estándares de seguridad corporativos, se aplican las siguientes reglas:

1.  **Aislamiento de Credenciales**: Los valores reales de las credenciales nunca deben incluirse en el archivo `.env`. Dichos valores residen exclusivamente en los secretos de GitHub o en el gestor de secretos corporativo.
2.  **Referencia Local**: El archivo `.env` en la raíz del repositorio se utiliza únicamente para recordar el mapa de variables y facilitar la configuración de entornos en la interfaz de GitHub.
3.  **Privacidad**: El archivo `.env` local está incluido en el `.gitignore` raíz para prevenir su exposición accidental en el repositorio.
4.  **Optimización OIDC**: Se prioriza el uso de OIDC para eliminar la dependencia de tokens estáticos (como `JSR_TOKEN`) en los flujos de trabajo de GitHub Actions.
5.  **Nomenclatura**: Se evitan prefijos reservados por la plataforma (ej. `GITHUB_`) para prevenir colisiones con las variables internas del sistema de CI.
