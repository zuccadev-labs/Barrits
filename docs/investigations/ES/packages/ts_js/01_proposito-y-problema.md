# 01 Proposito y problema de ts_js

Yo llegue a `barrits` porque queria reducir la friccion de ensamblaje repetitivo y mover mi foco hacia capacidades pequenas, composicion y exposicion semantica.

## Lo que yo queria evitar

Yo no queria que mi arquitectura dependiera de:

- clases sobredimensionadas
- jerarquias rigidas
- ensamblaje manual repetitivo
- mezclas accidentales entre codigo reusable, runtime y ejemplo

## Lo que yo queria conseguir

Yo buscaba cuatro cosas:

1. funciones pequenas como unidad minima
2. dominios como unidad semantica
3. barrels como frontera publica
4. composicion como mecanismo de extension

## Mi conclusion temprana

Yo entendi que `barrits/` no debia verse como runtime ni como framework. Para mi, `barrits/` es una convencion arquitectonica que luego debo proyectar a runtimes reales como Node, Deno o frontend.