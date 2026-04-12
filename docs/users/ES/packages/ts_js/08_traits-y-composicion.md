# 08 Traits y composicion de ts_js

Los traits declarativos se usan cuando se necesita composicion de dominio con contratos explicitos y menos drift entre implementacion, metadata y tooling.

## Que contrato uso

La base es `createTraitDescriptor()` con estas piezas:

- `name`
- `requires`
- `conflicts`
- `state`
- `provides`
- `create`

## Cuando uso JSDoc declarativo

Cuando se busca bajar friccion sin perder contrato, la metadata declarativa usa:

- `@barrits-trait`
- `@barrits-summary`
- `@barrits-requires`
- `@barrits-conflicts`
- `@barrits-state`
- `@barrits-consumes`
- `@barrits-provides`
- `@barrits-tags`
- `@barrits-runtime`
- `@barrits-version`
- `@barrits-stability`

## Que gano con ese modelo

Este modelo aporta cuatro beneficios concretos:

1. el orden deja de depender de mezcla manual de objetos
2. las dependencias faltantes fallan antes de ejecutar logica opaca
3. las colisiones pasan a ser explicitas
4. el estado tiene propietario declarado

## Cuando me conviene realmente

Esta capa conviene cuando se estan componiendo capacidades de dominio y no cuando solo se necesita un helper pequeno aislado. Para una mezcla trivial puede usarse `mergeTraits`, pero para contratos serios el descriptor declarativo debe ser la primera opcion.
