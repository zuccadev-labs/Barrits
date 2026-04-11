import { render } from "solid-js/web";
import manifest from "virtual:barrits/manifest";

import { createBuildManifestSummary, sumar } from "barrits";

const manifestSummary = createBuildManifestSummary(manifest);

const App = () => {
  return (
    <main style={{ "font-family": "Georgia, serif", padding: "2rem", "line-height": 1.5 }}>
      <h1>barrits Solid example</h1>
      <p>Suma operacional: {sumar(20, 22)}</p>
      <p>Imports detectados: {manifestSummary.importStatements.join(" | ") || "none"}</p>
    </main>
  );
};

render(() => <App />, document.getElementById("root") as HTMLElement);