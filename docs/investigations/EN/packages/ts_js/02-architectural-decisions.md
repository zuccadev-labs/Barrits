# 02 Architectural Decisions

During the research and prototyping process of the SDK, various implementation strategies were evaluated. The following decisions represent the technical conclusions governing the current `ts_js` architecture.

## Decision 1: Portable Core and Runtime Isolation

It was decided to develop a strictly portable TypeScript core, delegating specific execution details to adapters. This separation allows the same orchestration engine to serve Node.js and Deno ecosystems without duplicating primary business logic.

## Decision 2: "Package-First" Approach

While command-line utilities for diagnostics and automation are maintained, the priority integration experience is defined as "Package-First". The SDK is designed to be consumed as a programmatic dependency that orchestrates the developer's workflow.

## Decision 3: Encapsulation of `barrits_lib`

The `barrits_lib` library is maintained as an internal support and reusable algorithms library. However, its architecture is internal; the final consumer interacts exclusively with the SDK surface, protecting the user from the complexity of the underlying business logic.

## Decision 4: Examples as Real Consumer Projects

It was determined that integration examples must function as independent projects. This decision ensures that usage scenarios faithfully validate the external developer's experience, preventing them from becoming mere demonstrations mixed with the core source code.

## Decision 5: Classification as an SDK, Not a Framework

Following the transition to a monorepo structure, the term "SDK" was selected as the correct convention. The project's objective is to provide an integration surface per language and runtime, rather than imposing a complete or closed technology stack.
