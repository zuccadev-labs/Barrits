# 01 Propósito y problema de ts_js

El proyecto `barrits` nace de la necesidad de reducir la fricción en el ensamblaje repetitivo de software, desplazando el enfoque del desarrollo hacia la creación de capacidades modulares, la composición y la exposición semántica clara de servicios.

## Problemática Abordada

Se identificaron varios factores de ineficiencia que la arquitectura de `barrits` busca mitigar:

- **Rigidez Estructural**: Dependencia de jerarquías de clases sobredimensionadas.
- **Acoplamiento Operativo**: Ensamblaje manual y repetitivo de componentes.
- **Contaminación de Contextos**: Mezcla accidental de código reusable, detalles de runtime y artefactos de ejemplo dentro del mismo espacio lógico.

## Objetivos de Diseño

La investigación técnica se centró en alcanzar cuatro pilares fundamentales:

1.  **Funciones Atómicas**: Adopción de funciones pequeñas como unidad mínima de lógica.
2.  **Dominios Semánticos**: Agrupación de capacidades bajo unidades de dominio coherentes.
3.  **Fronteras Públicas**: Uso de barrels para definir superficies de exposición controladas.
4.  **Composición Dinámica**: Empleo de la composición como el mecanismo principal de extensión y flexibilidad.

## Tesis Arquitectónica Resultante

La conclusión técnica fundamental es que `barrits` no debe ser catalogado como un runtime ni como un framework tradicional. Por el contrario, se define como una **convención arquitectónica** diseñada para ser proyectada en runtimes específicos (Node.js, Deno, Frontend) manteniendo la integridad del modelo de dominio.