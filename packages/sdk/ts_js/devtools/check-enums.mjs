import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const SDK = "F:/Development/Programacion/labs-packages/barrits/packages/sdk/ts_js";
function fdir(d) {
  const r = [];
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory() && e.name !== "node_modules" && e.name !== ".git") r.push(...fdir(f));
    else if (e.isFile() && e.name.endsWith(".ts") && !e.name.endsWith(".d.ts")) r.push(f);
  }
  return r;
}
const files = [...fdir(join(SDK, "src")), ...fdir(join(SDK, "adapters/deno"))];
let found = 0;
for (const fp of files) {
  const sf = ts.createSourceFile(fp, readFileSync(fp, "utf8"), ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const exp = (n) => n.modifiers && n.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  function v(n) {
    ts.forEachChild(n, v);
    if (n.kind === ts.SyntaxKind.EnumDeclaration && exp(n)) {
      for (const m of n.members) {
        if (!ts.getJSDocCommentsAndTags(m).length) { console.log(`${fp.replace(/.*ts_js[\\/]/, "")}: enum ${n.name.getText(sf)}.${m.name.getText(sf)}`); found++; }
      }
    }
  }
  v(sf);
}
console.log(found === 0 ? "✓ no undocumented enum members" : `undocumented enum members: ${found}`);
