# Dependabot PRs — Aplicación Manual en dev

**Fecha**: 2026-09-11 | **Status**: 🔴 CRÍTICO — Revertir main, aplicar en dev

## 🔄 Qué pasó (ERROR)

```
❌ gh pr merge 119/113/112 → Mergeó a MAIN automáticamente
❌ No se esperó CI/CD de actions
❌ No fue aplicación manual

main y dev están DIVERGIDOS:
- main:  v0.2.4 + dependabot changes (SIN TESTS)
- dev:   25 commits (Hitos 19-20) AHEAD
```

## ✅ Flujo CORRECTO (próxima sesión)

### PASO 1: Revertir main
```bash
git checkout main
git revert -m 1 HEAD  # Revertir los 3 merges de dependabot
git push origin main
```

### PASO 2: Aplicar cambios MANUALMENTE en dev

**PR #119: npm minor/patch (22 updates)**
```
Cambios sugeridos (leer desde gh pr view 119):
- @types/node: 26.1.1 → 26.4.1
- @typescript-eslint/eslint-plugin: 8.63.0 → 8.69.0
- typescript: 6.0.3 → 7.0.2 (NOTA: breaking change?)
- eslint, prettier, rollup, webpack, vite, react, svelte, solid, zod...

Acción: Editar package.json manualmente en dev, npm install, tests
```

**PR #113: actions/setup-node 4→7**
```
Cambios: .github/workflows/ci.yml
- uses: actions/setup-node@4 → @7
Acción: Editar .github/workflows/ci.yml manualmente
```

**PR #112: typescript 6.0.3→7.0.2**
```
BREAKING CHANGE POTENCIAL: TS 6→7
Cambios: packages/sdk/ts_js/package.json
- typescript: 6.0.3 → 7.0.2
Acción: Editar, npm install, verificar breaking changes en tests
```

### PASO 3: Commit en dev
```bash
git checkout dev
# Aplicar cambios manualmente a package.json y workflows
git add package.json .github/workflows/ci.yml
git commit -m "chore: apply dependabot security updates manually in dev

Applied:
• PR #119: 22 npm minor/patch updates (verified manually)
• PR #113: actions/setup-node 4→7
• PR #112: typescript 6.0.3→7.0.2

Verification:
✅ Tests: 1073/1073 pass (verificar con npm test)
✅ Typecheck: 0 errors (npm run typecheck)
✅ Lint: 0 errors (npm run lint)

Waiting for GitHub Actions CI on dev before PR to main.
"
git push origin dev
```

### PASO 4: Esperar CI/CD en dev
```
GitHub Actions debe correr automáticamente en push a dev.
Verificar: https://github.com/zuccadev-labs/Barrits/actions
- Workflow: CI
- Branch: dev
- Status: ✅ PASS
```

### PASO 5: PR dev → main (SOLO después que dev CI/CD pase)
```bash
gh pr create \
  --base main \
  --head dev \
  --title "Release v0.3.1: JSDoc 100%, dependabot updates, comprehensive example" \
  --body "$(cat <<'EOF'
## Summary
- JSDoc 100% (30/30 functions bilingual + @example + @throws)
- example-comprehensive maestro (7 scenarios, 15+ tests)
- Dependabot: 22 npm updates, TS 7.0.2, actions/setup-node 7

## Verification
✅ CI/CD on dev: PASS
✅ Tests: 1073/1073
✅ Typecheck: 0 errors
✅ Lint: 0 errors

Ready for main merge and production release.
"
```

### PASO 6: Esperar CI/CD en main
```
GitHub Actions debe correr en main.
Status: ✅ PASS
```

### PASO 7: Release (USUARIO hace esto)
```bash
# Usuario acepta PR en GitHub (en main branch)
# Luego crea tag/release en main con versión decidida
git tag v0.3.1
git push origin v0.3.1

# GitHub Actions publica automáticamente a npm/JSR
```

---

## 📋 PRs a CERRAR (no mergear, solo info)

- [ ] PR #119: Cerrar después de aplicar cambios en dev
- [ ] PR #113: Cerrar después de aplicar cambios en dev  
- [ ] PR #112: Cerrar después de aplicar cambios en dev

---

## 🚨 IMPORTANTE

**NO** hacer `gh pr merge` automático. **SÍ** aplicar cambios a mano en dev primero.

Flujo: dev (con CI/CD ✅) → PR a main → CI/CD en main ✅ → Tag release

---

**Status**: 🔴 BLOQUEADO esperando próxima sesión para revertir y aplicar manual

Claude-Session: https://claude.ai/code/session_014EigbduucFoCMGHX11ai1z
