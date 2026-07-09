/**
 * analyze-deno-doc.mjs
 * Parses `deno doc --json` output (what JSR uses to score symbol docs) and
 * counts documented vs undocumented exported symbols, including nested
 * class/interface/enum/namespace members. Mirrors JSR's "Has docs for most
 * symbols" scoring.
 * @module
 */
import { readFileSync } from "node:fs";

const file = process.argv[2];
const buf = readFileSync(file);
let text;
if (buf[0] === 0xff && buf[1] === 0xfe) text = buf.toString("utf16le", 2);
else if (buf[0] === 0xfe && buf[1] === 0xff) text = buf.toString("utf16le").replace(/^\uFEFF/, "");
else if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) text = buf.toString("utf8", 3);
else text = buf.toString("utf8");
const data = JSON.parse(text);

function getJsDoc(node) {
  if (!node) return null;
  if (node.jsDoc) return node.jsDoc;
  if (node.declarations && node.declarations[0] && node.declarations[0].jsDoc) return node.declarations[0].jsDoc;
  return null;
}
function hasDoc(node) {
  const jd = getJsDoc(node);
  if (!jd) return false;
  if (typeof jd === "string") return jd.trim().length > 0;
  if (jd.doc && String(jd.doc).trim().length > 0) return true;
  if (jd.tags && Array.isArray(jd.tags) && jd.tags.length > 0) return true;
  return false;
}
function locOf(node) {
  const l = node?.location ?? node?.declarations?.[0]?.location;
  if (!l) return "?";
  return `${l.filename.split("ts_js/")[1] ?? l.filename}:${l.line ?? "?"}`;
}

const results = [];
let total = 0;
let documented = 0;

function record(node, path) {
  const name = node.name ?? "<anon>";
  const kind = node.kind ?? "?";
  const d = hasDoc(node);
  results.push({ kind, name, path, documented: d, loc: locOf(node) });
  total++;
  if (d) documented++;
}

function walkDefMembers(def, path) {
  if (!def) return;
  for (const arr of ["methods", "properties", "getters", "setters", "indexSignatures", "callSignatures", "enum", "enums"]) {
    if (Array.isArray(def[arr])) {
      for (const m of def[arr]) record(m, path);
    }
  }
  if (Array.isArray(def.nodes)) {
    for (const m of def.nodes) walkSymbol(m, path);
  }
}

function walkSymbol(sym, path) {
  record(sym, path);
  const decl = sym.declarations && sym.declarations[0];
  walkDefMembers(decl && decl.def, `${path}/${sym.name ?? ""}`);
  // Some symbols carry nested symbols inline (e.g. namespace details)
  if (Array.isArray(sym.symbols)) {
    for (const m of sym.symbols) walkSymbol(m, `${path}/${sym.name ?? ""}`);
  }
}

const rootNodes = data.nodes ?? {};
for (const fileUrl of Object.keys(rootNodes)) {
  const fileEntry = rootNodes[fileUrl];
  const symbols = fileEntry.symbols ?? [];
  for (const sym of symbols) walkSymbol(sym, "");
}

const pct = total > 0 ? ((documented / total) * 100).toFixed(1) : "N/A";
console.log(`Total exported symbols (incl. members): ${total}`);
console.log(`Documented: ${documented} (${pct}%)`);
console.log(`Undocumented: ${total - documented}`);
const undoc = results.filter((r) => !r.documented);
if (undoc.length) {
  console.log("\n--- Undocumented symbols ---");
  for (const u of undoc.sort((a, b) => a.loc.localeCompare(b.loc))) {
    console.log(`  ${u.loc}  [${u.kind}] ${u.path ? u.path + " / " : ""}${u.name}`);
  }
}
console.log(`\n${Number(pct) >= 80 ? "✓ >= 80%" : "✗ < 80% (JSR partial)"}`);
if (Number(pct) < 80) process.exitCode = 1;
