# Evolución Arquitectónica hacia Micro-Servicios SRP

## Contexto Histórico

Originalmente, el motor de parsing de `barrits` operaba mediante un pipeline de integración monolítico (principalmente centralizado en `inspect.ts` con más de 1600 líneas de código). Este monolito concentraba la validación de colisiones, la inyección sintáctica, el escrutinio de traits y el crawleo de sistema de archivos (DFS). A medida que el SDK escala hacia un patrón de adopción masiva para ecosistemas Deno y Node bajo arquitecturas _backend-as-a-service_ de alta demanda, dicho acoplamiento limitaba la reutilización del código e inyectaba deudas técnicas considerables.

## Decisión de Ingeniería

Se determinó llevar a cabo una deconstrucción profunda del flujo central aplicando rigurosamente principios de _Single Responsibility Principle (SRP)_ y adoptando un modelo de micro-servicios aislados. 

El resultado de esta fragmentación derivó en dominios nativamente desacoplados:
1. **`ast/cache`**: Orientado 100% a preservar el mecanismo de "0ms Incremental AST Differential Caching". Controla estrictamente los SourceFiles oxidados y previene la latencia experimentada en ecosistemas basados en scraping repetitivo (ej., UnJS).
2. **`ast/extractor`**: Componente asíncrono para el parseo profundo de declaraciones TS y lecturas recursivas de `dependencies`.
3. **`ast/traits` y `ast/diagnostics`**: Sistemas aislados responsables de capturar el JSDoc (Godoc-style) corporativo y forzar candados lógicos contra colisiones internas (Traits que no pueden depender de sus mismos slots, etc.).
4. **`graph/collisions` e `imports`**: Monitores de integración dedicados al mapeo de alias y sobreescrituras en tiempo de ejecución.
5. **`crawler/layer`**: Aislamiento del escáner en disco mediante DFS limpio sin lógica mutante.

Con esta arquitectura, `inspect.ts` se redujo a la mínima expresión (< 300 líneas), operando como un orquestador transparente del ecosistema.

## Consecuencias y Ventajas

1. **Escalabilidad de Equipos**: Ahora, un ingeniero de plataforma puede realizar mantenimiento sobre la red de caché (`ast/cache`) mientras otro perfecciona la lógica de diagnósticos de dominio (`ast/diagnostics`), operando nativamente sin crear conflictos _Merge_ en un monolito global.
2. **Posicionamiento Corporativo**: Posiciona a `barrits` para ser un core de orquestación a gran escala, idóneo para despliegues Deno seguros.
3. **Mantenimiento**: La documentación interna se rige bajo estricto JSDoc (estilo Godoc) funcional en lugar de comentarios procedurales o informales. Cada _micro-servicio_ posee su propia justificación en código dictando no un "qué hace el paso uno, paso dos", sino "qué responsabilidad arquitectónica resuelve su firma en la interfaz".

## Prevención contra Regresiones

Para mantener este flujo:
- Nunca mezclar el mapeo del sistema de archivos (`crawler/*`) con las abstracciones de sintaxis abstracta (`ast/*`).
- No regresar la inyección recursiva profunda al Orquestador (`inspect.ts`).
- Continuar resguardando toda validación criptográfica en componentes aislados mediante la validación de firmas por `checksum` que garantiza a ecosistemas consumidores que la cadena no ha sido falsificada o suplantada.
