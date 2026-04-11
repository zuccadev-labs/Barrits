import { readNodeLanguageToolSnapshot } from "@zuccadev-labs/barrits/node";

const snapshotPath = process.env.BARRITS_WATCH_SNAPSHOT ?? process.argv[2];

if (!snapshotPath) {
  console.error("missing-snapshot-path");
  process.exit(1);
}

const snapshot = await readNodeLanguageToolSnapshot(snapshotPath);

console.log(JSON.stringify({
  snapshotPath,
  mode: snapshot.mode,
  domains: snapshot.domains.map((domain) => domain.name),
  importStatements: snapshot.importStatements,
  filters: snapshot.filters ?? null,
}, null, 2));