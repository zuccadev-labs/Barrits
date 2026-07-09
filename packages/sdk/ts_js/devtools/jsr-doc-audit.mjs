/**
 * jsr-doc-audit.mjs
 * Fetches the published JSR package doc page and extracts which exported
 * symbols JSR renders WITHOUT a description (markdown_summary) — i.e. the
 * undocumented symbols that drag down the "Has docs for most symbols" score.
 * @module
 */
const PKG = "zuccadev-labs/barrits";

async function main() {
  const url = `https://jsr.io/@${PKG}/doc`;
  const res = await fetch(url);
  const html = await res.text();
  console.error(`fetched ${html.length} bytes`);

  // Symbol anchors: <a href="/@zuccadev-labs/barrits/doc/.../~/NAME" ...>...</a>
  const anchorRe = /<a\s+href="\/@zuccadev-labs\/barrits\/doc\/[^"]*?\/~\/([^"?]+)(?:\?[^"]*)?"[^>]*>/g;
  const symbols = [];
  let m;
  while ((m = anchorRe.exec(html)) !== null) {
    const name = decodeURIComponent(m[1]);
    const pos = m.index;
    const after = html.slice(pos, pos + 2000);
    const sumIdx = after.indexOf("markdown_summary");
    const hasSummary = sumIdx !== -1 && /<p>/.test(after.slice(sumIdx));
    symbols.push({ name, documented: hasSummary, pos });
  }

  // Dedupe by name (same symbol may appear in nav + body)
  const byName = new Map();
  for (const s of symbols) {
    if (!byName.has(s.name)) byName.set(s.name, s);
  }
  const list = [...byName.values()];
  const total = list.length;
  const documented = list.filter((s) => s.documented).length;
  const pct = total > 0 ? ((documented / total) * 100).toFixed(1) : "N/A";
  console.log(`Total symbols linked in doc page: ${total}`);
  console.log(`Documented (have summary): ${documented} (${pct}%)`);
  console.log(`Undocumented (no summary): ${total - documented}`);
  const undoc = list.filter((s) => !s.documented);
  if (undoc.length) {
    console.log("\n--- Undocumented symbols (JSR-rendered) ---");
    for (const u of undoc.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  ${u.name}`);
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
