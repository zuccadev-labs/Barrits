# 08 Traits y composicion de ts_js

Yo uso traits declarativos cuando necesito composicion de dominio con contratos explicitos y menos drift entre implementacion, metadata y tooling.

## Que contrato uso

Mi base es `createTraitDescriptor()` con estas piezas:

- `name`
- `requires`
- `conflicts`
- `state`
- `provides`
- `create`

## Cuando uso JSDoc declarativo

Si yo quiero bajar friccion sin perder contrato, describo metadata con:

- `@barrits-trait`
- `@barrits-summary`
- `@barrits-requires`
- `@barrits-conflicts`
- `@barrits-state`
- `@barrits-consumes`
- `@barrits-provides`
- `@barrits-tags`
- `@barrits-runtime`

## Que gano con ese modelo

Yo gano cuatro cosas concretas:

1. el orden deja de depender de mezcla manual de objetos
2. las dependencias faltantes fallan antes de ejecutar logica opaca
3. las colisiones pasan a ser explicitas
4. el estado tiene propietario declarado

## Cuando me conviene realmente

Yo uso esta capa cuando estoy componiendo capacidades de dominio y no cuando solo necesito un helper pequeno aislado. Si solo busco una mezcla trivial, puedo seguir usando helpers pequenos como `mergeTraits`, pero para contratos mas serios prefiero descriptor declarativo primero.