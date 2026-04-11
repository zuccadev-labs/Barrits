import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { defineBarritsPackage, toBarritsAutomationOptions } from "barrits";
import { barritsVitePlugin } from "barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});

export default defineConfig({
  plugins: [react(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});