# 06 Configuración JSR y GitHub Actions

Este documento detalla el procedimiento técnico para vincular el paquete JSR con el repositorio de GitHub, habilitando "Trusted Publishing" mediante OIDC desde GitHub Actions y eliminando la dependencia de tokens estáticos.

## Objetivo del Estado Final

El modelo de publicación busca alcanzar los siguientes hitos de seguridad y automatización:

- **npm**: Publicación sin tokens persistentes mediante OIDC.
- **JSR**: Publicación sin tokens persistentes mediante OIDC.
- **Gobernanza**: El flujo operativo no requiere de las variables `NPM_TOKEN_PUBLICAR_NPM` ni `JSR_TOKEN` para su ejecución normal.

## Paso 1: Preparación del Entorno en GitHub

Se deben certificar las siguientes condiciones en la interfaz de GitHub:

1.  Existencia y vigencia del repositorio destinado a las releases oficiales.
2.  El workflow de lanzamiento ([release.yml](../../.github/workflows/release.yml)) debe declarar `permissions.id-token: write`.
3.  Configuración de los entornos (Environments) `npm` y `jsr`.

### Protocolo de Lanzamiento Inicial (Bootstrap) en npm

Si el paquete `@zuccadev-labs/barrits` no existe previamente en npm, y ante la imposibilidad de configurar "Trusted Publishing" sobre un paquete inexistente, se seguirá este protocolo:

1.  Ejecución de un primer lanzamiento (publish) manual o automático utilizando un token granular `NPM_TOKEN_PUBLICAR_NPM`.
2.  Tras la creación exitosa del paquete, se configura "Trusted Publishing" vinculando el repositorio y el workflow `release.yml`.
3.  El token inicial se retira del flujo operativo estándar.

## Paso 2: Configuración del Paquete en JSR

En el registro `jsr.io`, se deben realizar las siguientes acciones:

1.  Acceso mediante la cuenta propietaria del scope `@zuccadev-labs`.
2.  Verificación de la existencia del paquete `@zuccadev-labs/barrits`.
3.  Validación de que el nombre del paquete coincida exactamente con la definición en el archivo `jsr.json` del SDK.

## Paso 3: Vinculación de Repositorio en JSR

Dentro de la sección de parámetros (`Settings`) del paquete en `jsr.io`, es imperativo realizar el enlace con el repositorio de GitHub correspondiente. Este vínculo permite que JSR reconozca las solicitudes de publicación provenientes de GitHub Actions y valide la identidad mediante OIDC.

## Paso 4: Validación del Flujo de Trabajo (Workflow)

Se debe auditar el archivo `release.yml` para confirmar los siguientes componentes:

- Ejecución de los jobs de publicación en entornos seguros de GitHub Actions.
- Implementación de permisos de escritura para tokens de identidad (`id-token: write`).
- Empleo de comandos de publicación nativos (`npx jsr publish` y `npm publish`).
- Inclusión del flag `--provenance` en npm para certificar la cadena de suministro.
- Ejecución previa de validaciones técnicas (`dry-run`).

## Indicadores de Configuración Exitosa

La configuración se considera certificada cuando:

- GitHub Actions publica en JSR y npm sin requerir tokens de autenticación estáticos.
- Las publicaciones en JSR generan metadatos de confianza vinculados al flujo de GitHub.
- El paquete refleja el enlace oficial con el código fuente en la interfaz de JSR.
- Las ejecuciones duplicadas de la misma versión se gestionan de forma determinista y segura.
