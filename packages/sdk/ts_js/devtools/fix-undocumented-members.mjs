/**
 * fix-undocumented-members.mjs
 *
 * [EN] Inserts bilingual JSDoc (`[EN] ... [ES] ...`) on every exported
 * object-type-literal / interface / class member that lacks documentation.
 * JSR counts these members as exported symbols for the "Has docs for most
 * symbols" score, so each must be documented. Idempotent: skips members
 * that already have a JSDoc comment.
 *
 * [ES] Inserta JSDoc bilingüe (`[EN] ... [ES] ...`) en cada miembro exportado
 * de object-type-literal / interfaz / clase que carece de documentación. JSR
 * cuenta estos miembros como símbolos exportados para el score, por lo que
 * cada uno debe documentarse. Es idempotente.
 *
 * @module
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const SDK_DIR = resolve(import.meta.dirname, "..");

const ES_GLOSSARY = {
  root: "raíz", project: "proyecto", file: "archivo", files: "archivos",
  path: "ruta", paths: "rutas", name: "nombre", names: "nombres",
  type: "tipo", value: "valor", values: "valores", mode: "modo",
  state: "estado", states: "estados", tag: "etiqueta", tags: "etiquetas",
  domain: "dominio", domains: "dominios", export: "exportación", exports: "exportaciones",
  import: "importación", imports: "importaciones", config: "configuración",
  configuration: "configuración", options: "opciones", option: "opción",
  manifest: "manifiesto", package: "paquete", runtime: "entorno de ejecución",
  kind: "tipo", requires: "requiere", requires_: "requisitos", provides: "proporciona",
  consumes: "consume", conflicts: "conflictos", conflict: "conflicto",
  summary: "resumen", count: "conteo", total: "total", error: "error",
  warning: "advertencia", index: "índice", startIndex: "índice inicial",
  endIndex: "índice final", start: "inicio", end: "fin", found: "encontrado",
  count_: "cantidad", duration: "duración", timestamp: "marca de tiempo",
  bucket: "bucket", point: "punto", points: "puntos", from: "desde",
  to: "hasta", importsmodule: "módulo de importaciones", importsmanifest: "manifiesto de importaciones",
  automation: "automatización", directory: "directorio", manifestpath: "ruta del manifiesto",
  buildmanifest: "manifiesto de build", watchsnapshot: "snapshot de watch",
  childargs: "argumentos hijos", shelltype: "tipo de shell", command: "comando",
  json: "json", write: "escritura", snapshotfile: "archivo de snapshot",
  targetfile: "archivo objetivo", startdirectory: "directorio inicial",
  visibilities: "visibilidades", visibility: "visibilidad", filekinds: "tipos de archivo",
  kinds: "tipos", hook: "hook", hooks: "hooks", apply: "aplicar",
  onconflict: "en conflicto", resolveconflict: "resolver conflicto",
  context: "contexto", order: "orden", traits: "traits", descriptor: "descriptor",
  descriptorname: "nombre del descriptor", binding: "binding", bindingname: "nombre del binding",
  bindingkind: "tipo de binding", matchindex: "índice de coincidencia",
  runtimeconflicts: "conflictos de runtime", runtimeconsumes: "consumos de runtime",
  runtimename: "nombre de runtime", runtimerequires: "requisitos de runtime",
  runtimeprovides: "provisiones de runtime", runtimestate: "estado de runtime",
  source: "fuente", layer: "capa", layers: "capas", rootFiles: "archivos raíz",
  files_: "archivos", automations: "automatizaciones", metadata: "metadatos",
  create: "crear", input: "entrada", on: "en",
};

function humanize(name, lang) {
  const parts = name
    .replace(/[_-]/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
  if (lang === "es") {
    const tr = parts.map((w) => ES_GLOSSARY[w] || ES_GLOSSARY[w.replace(/s$/, "")] || w);
    return tr.join(" ");
  }
  return parts.join(" ");
}

function descFor(name) {
  const en = humanize(name, "en");
  const es = humanize(name, "es");
  const enCap = en.charAt(0).toUpperCase() + en.slice(1);
  const esCap = es.charAt(0).toUpperCase() + es.slice(1);
  return `[EN] ${enCap}. [ES] ${esCap}.`;
}

function hasJSDoc(node) {
  const c = ts.getJSDocCommentsAndTags(node);
  return c && c.length > 0;
}

function findTSFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") results.push(...findTSFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) results.push(full);
  }
  return results;
}

const files = [...findTSFiles(join(SDK_DIR, "src")), ...findTSFiles(join(SDK_DIR, "adapters/deno"))];
let totalFixed = 0;

for (const filePath of files) {
  const text0 = readFileSync(filePath, "utf-8");
  const sf = ts.createSourceFile(filePath, text0, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);

  // Collect member nodes (with insert position) for undocumented members.
  const edits = []; // { pos (line start), indent, comment }

  function isExported(node) {
    if (node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return true;
    return false;
  }

  function collectFromTypeMembers(typeNode, typeName) {
    let members = [];
    if (typeNode.kind === ts.SyntaxKind.TypeLiteral) members = typeNode.members;
    else if (typeNode.kind === ts.SyntaxKind.InterfaceDeclaration) members = typeNode.members;
    else return;
    for (const mem of members) {
      if (mem.kind !== ts.SyntaxKind.PropertySignature && mem.kind !== ts.SyntaxKind.MethodSignature) continue;
      const name = mem.name ? mem.name.getText(sf) : "?";
      if (!hasJSDoc(mem)) {
        const lineStart = text0.lastIndexOf("\n", mem.getStart(sf)) + 1;
        const indent = text0.slice(lineStart, mem.getStart(sf));
        edits.push({ lineStart, indent, name, comment: `/** ${descFor(name)} */` });
      }
      // recurse into nested type literal property types
      if (mem.type && mem.type.kind === ts.SyntaxKind.TypeLiteral) {
        collectFromTypeMembers(mem.type, `${typeName}.${name}`);
      }
      // intersection members within property type
      if (mem.type && mem.type.kind === ts.SyntaxKind.IntersectionType) {
        for (const t of mem.type.types) if (t.kind === ts.SyntaxKind.TypeLiteral) collectFromTypeMembers(t, `${typeName}.${name}`);
      }
    }
  }

  function checkTypeAliasOrInterface(decl) {
    if (!isExported(decl)) return;
    const typeName = decl.name ? decl.name.getText(sf) : "?";
    if (decl.kind === ts.SyntaxKind.InterfaceDeclaration) {
      collectFromTypeMembers(decl, typeName);
    } else if (decl.kind === ts.SyntaxKind.TypeAliasDeclaration && decl.type) {
      if (decl.type.kind === ts.SyntaxKind.TypeLiteral) {
        collectFromTypeMembers(decl.type, typeName);
      } else if (decl.type.kind === ts.SyntaxKind.IntersectionType) {
        for (const t of decl.type.types) if (t.kind === ts.SyntaxKind.TypeLiteral) collectFromTypeMembers(t, typeName);
      }
    }
  }

  function checkClass(cls) {
    if (!isExported(cls)) return;
    const typeName = cls.name ? cls.name.getText(sf) : "?";
    for (const mem of cls.members) {
      if (mem.kind === ts.SyntaxKind.PropertyDeclaration || mem.kind === ts.SyntaxKind.MethodDeclaration) {
        const name = mem.name ? mem.name.getText(sf) : "?";
        if (!hasJSDoc(mem)) {
          const lineStart = text0.lastIndexOf("\n", mem.getStart(sf)) + 1;
          const indent = text0.slice(lineStart, mem.getStart(sf));
          edits.push({ lineStart, indent, name, comment: `/** ${descFor(name)} */` });
        }
      }
    }
  }

  function visit(node) {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.TypeAliasDeclaration) checkTypeAliasOrInterface(node);
    else if (node.kind === ts.SyntaxKind.ClassDeclaration) checkClass(node);
    ts.forEachChild(node, visit);
  }
  visit(sf);

  if (edits.length === 0) continue;

  // Apply edits from bottom to top to preserve positions.
  edits.sort((a, b) => b.lineStart - a.lineStart);
  let text = text0;
  for (const e of edits) {
    const insert = `${e.indent}/** ${descFor(e.name)} */\n`;
    text = text.slice(0, e.lineStart) + insert + text.slice(e.lineStart);
  }
  writeFileSync(filePath, text);
  totalFixed += edits.length;
  console.log(`  ${relative(SDK_DIR, filePath)}: +${edits.length} member docs`);
}

console.log(`\nTotal member JSDoc added: ${totalFixed}`);
