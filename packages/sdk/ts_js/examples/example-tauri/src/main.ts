import { invoke } from "@tauri-apps/api/core";
import {
  readBuildManifestSummary,
  readLanguageToolSnapshot,
  type BarritsConsumedStateSummary,
  type BarritsLanguageToolSnapshot,
} from "barrits/consume";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app container.");
}

app.innerHTML = `
  <main style="font-family: 'Segoe UI', sans-serif; max-width: 960px; margin: 0 auto; padding: 32px; color: #102030;">
    <header style="margin-bottom: 24px;">
      <p style="letter-spacing: 0.14em; text-transform: uppercase; color: #3b5b6d; font-size: 12px; margin: 0 0 8px;">barrits + tauri</p>
      <h1 style="margin: 0; font-size: 2.4rem;">Secure desktop consume flow</h1>
      <p style="line-height: 1.6; max-width: 720px; color: #38505f;">El renderer no toca el filesystem directo. El backend Tauri valida rutas y usa los readers seguros de barrits/consume para devolver summaries listos para UI.</p>
    </header>
    <section style="display: grid; gap: 16px; margin-bottom: 24px; background: linear-gradient(135deg, #eef7f5, #f6efe6); border: 1px solid #d6e0dd; border-radius: 20px; padding: 20px;">
      <label style="display: grid; gap: 8px;">
        <span>Build manifest path</span>
        <input id="build-path" value=".cache/barrits/build-manifest.json" style="padding: 12px; border-radius: 12px; border: 1px solid #c4d2d0;" />
      </label>
      <label style="display: grid; gap: 8px;">
        <span>Watch snapshot path</span>
        <input id="snapshot-path" value=".cache/barrits/watch-snapshot.json" style="padding: 12px; border-radius: 12px; border: 1px solid #c4d2d0;" />
      </label>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button id="load-build" style="padding: 12px 18px; border: 0; border-radius: 999px; background: #173f5f; color: white; cursor: pointer;">Load build summary</button>
        <button id="load-snapshot" style="padding: 12px 18px; border: 0; border-radius: 999px; background: #206a5d; color: white; cursor: pointer;">Load language snapshot</button>
      </div>
    </section>
    <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      <article style="border: 1px solid #d6e0dd; border-radius: 18px; padding: 20px; background: white;">
        <h2 style="margin-top: 0;">Build summary</h2>
        <pre id="build-output" style="white-space: pre-wrap; font-size: 13px; color: #2d4553;"></pre>
      </article>
      <article style="border: 1px solid #d6e0dd; border-radius: 18px; padding: 20px; background: white;">
        <h2 style="margin-top: 0;">Language snapshot</h2>
        <pre id="snapshot-output" style="white-space: pre-wrap; font-size: 13px; color: #2d4553;"></pre>
      </article>
    </section>
  </main>
`;

const buildPathInput = document.querySelector<HTMLInputElement>("#build-path");
const snapshotPathInput = document.querySelector<HTMLInputElement>("#snapshot-path");
const buildOutput = document.querySelector<HTMLPreElement>("#build-output");
const snapshotOutput = document.querySelector<HTMLPreElement>("#snapshot-output");
const loadBuildButton = document.querySelector<HTMLButtonElement>("#load-build");
const loadSnapshotButton = document.querySelector<HTMLButtonElement>("#load-snapshot");

const formatPayload = (value: unknown) => JSON.stringify(value, null, 2);

const readTextFile = async (relativePath: string): Promise<string> => {
  return invoke<string>("read_allowed_text_file", { relativePath });
};

const renderError = (target: HTMLPreElement | null, error: unknown) => {
  if (!target) {
    return;
  }

  target.textContent = error instanceof Error ? error.message : String(error);
};

loadBuildButton?.addEventListener("click", async () => {
  try {
    const payload: BarritsConsumedStateSummary = await readBuildManifestSummary(
      buildPathInput?.value ?? ".cache/barrits/build-manifest.json",
      readTextFile,
    );
    if (buildOutput) {
      buildOutput.textContent = formatPayload(payload);
    }
  } catch (error) {
    renderError(buildOutput, error);
  }
});

loadSnapshotButton?.addEventListener("click", async () => {
  try {
    const payload: BarritsLanguageToolSnapshot = await readLanguageToolSnapshot(
      snapshotPathInput?.value ?? ".cache/barrits/watch-snapshot.json",
      readTextFile,
    );
    if (snapshotOutput) {
      snapshotOutput.textContent = formatPayload(payload);
    }
  } catch (error) {
    renderError(snapshotOutput, error);
  }
});