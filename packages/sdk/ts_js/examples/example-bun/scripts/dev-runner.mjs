import { readBunLanguageToolSnapshot } from "@zuccadev-labs/barrits/bun";

const snapshotPath = process.env.BARRITS_WATCH_SNAPSHOT;

if (snapshotPath) {
  try {
    const snapshot = await readBunLanguageToolSnapshot(snapshotPath);
    console.log(JSON.stringify({
      mode: snapshot.mode,
      domains: snapshot.domains.map((d) => d.name),
      importStatements: snapshot.importStatements,
    }, null, 2));
  } catch {
    console.log("watch: no snapshot");
  }
} else {
  console.log("watch: no BARRITS_WATCH_SNAPSHOT set");
}
