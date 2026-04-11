# 02 Decisiones de arquitectura de ts_js

Durante la investigacion yo probe varias formas de bajar la idea a un paquete real. Las decisiones que mantuve son estas.

## Decision 1: core portable primero

Yo elegi escribir un core TypeScript portable y dejar detalles de runtime en adapters. Eso me permitio servir Node y Deno sin duplicar la logica principal.

## Decision 2: package-first antes que command-first

Yo mantuve comandos para fallback, diagnostico y automatizacion, pero la experiencia principal la defini como package-first.

## Decision 3: `barrits_lib` interno y no visible

Yo conserve `barrits_lib` porque me sirve como biblioteca interna reusable, pero deje de tratarlo como contrato que el consumidor tenga que replicar.

## Decision 4: ejemplos visibles como consumidores reales

Yo entendi que los ejemplos debian mostrar experiencias reales de consumo. Por eso los mantengo como proyectos consumidores y no como demos mezcladas con el core.

## Decision 5: `sdk` y no `framework`

Cuando evolucione el repo a monorepo, yo elegi `sdk` como convencion correcta porque la unidad real que estoy construyendo es una superficie por lenguaje y runtime, no un framework completo por stack.