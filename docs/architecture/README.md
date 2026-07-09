# C4 Architecture Diagrams

[C4 model](https://c4model.com/) architecture diagrams for the Barrits monorepo.

## Prerequisites

Install [PlantUML](https://plantuml.com/) to render the diagrams:

```bash
# VSCode: install "PlantUML" extension
# CLI: brew install plantuml / scoop install plantuml
# CLI alternative: java -jar plantuml.jar
```

## Diagrams

| Level | Diagram | File | Description |
|-------|---------|------|-------------|
| 1 | Context | `c4-context.puml` | System context: users, external systems (npm, JSR, Deno, Bun) |
| 2 | Container | `c4-container.puml` | Containers: CLI, SDK Core, Lib, Adapters, Plugins, Traits, IoC, Schema |
| 3 | Core SDK | `c4-component-core.puml` | Components: Discovery, Manifest, Consume, CLI, AST, Graph, Crawler |
| 3 | Adapters | `c4-component-adapters.puml` | Components: Node.js adapter, Deno adapter, Fallback implementations |
| 3 | Plugins | `c4-component-plugins.puml` | Components: Vite, esbuild, Rollup, Webpack plugins + shared infrastructure |

## Rendering

```bash
# Render all diagrams to PNG
plantuml docs/architecture/*.puml

# Or render a specific diagram
plantuml docs/architecture/c4-context.puml
```
