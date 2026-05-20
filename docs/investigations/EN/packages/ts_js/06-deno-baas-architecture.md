---
title: "06 — Deno BaaS Architecture (Parse-Server Alternative)"
description: "ADR and investigation record for the Deno BaaS architecture, Inversion of Control, and strict database delegation."
---

# 06 — Deno BaaS Architecture (Parse-Server Alternative)

## Context and Investigation

The original goal of `barrits` was to provide AST discovery to unify bundlers. However, the maturity of the **Trait-Oriented Programming** model proved that the same static metadata (what a module needs and what it provides) could be used to provision services at runtime.

A corporate opportunity was identified: building a pure Deno Backend-as-a-Service (BaaS) core to rival *Parse-Server*, but without the overhead of monolithic frameworks. Deno natively provides `Deno.KV` (native transactional database), which is ideal for this use case.

## Architectural Decisions (ADR)

1. **AST-Based Inversion of Control (IoC) instead of Runtime Decorators:**
   - **Decision:** Instead of using runtime decorators and `reflect-metadata` (which couples the code to a framework and degrades performance), the IoC container reads the build-time generated manifest.
   - **Why:** Keeps the code clean (only JSDoc / Traits comments) and 100% runtime agnostic.
   - **Implementation:** `BarritsIoCContainer` in `src/barrits/ioc/index.ts`.

2. **Schema Auto-generation (OpenAPI) from JSDoc:**
   - **Decision:** Infer OpenAPI v3.1 schemas dynamically using tags (e.g., `@barrits-trait http-endpoint`).
   - **Why:** Eliminates the classic desync between implementation and YAML/Swagger documentation.
   - **Implementation:** `generateOpenApiSchema` in `src/barrits/schema/openapi.ts`.

3. **Strict Database Delegation (Single Responsibility Principle):**
   - **Decision:** An official secure Deno KV adapter was originally implemented inside the core. However, it was ultimately decided to remove it completely.
   - **Why:** An AST orchestration engine should not maintain physical database implementations. Deno KV, Postgres, or Mongo must be provided and injected exclusively by the *Consumer BaaS* (like the new Parse-Server), keeping Barrits as a purely logical system that operates in memory.
   - **Impact:** Reduced SDK size, elimination of security responsibilities regarding filesystem I/O, and increased codebase cohesion.

## Results and Next Steps

This purification makes Barrits the ultimate bedrock for Artificial Intelligence (LLM) generated orchestrators and self-configuring corporate systems. The natural next step for the *Parse-Server replacement* development will be implementing the database adapters in the upper layer (the BaaS) and integrating runtime checkers (Zod/Valibot).

---

[← Conclusions and Design Limits](05-conclusions-and-limits.md) | [Index](00-index.md)
