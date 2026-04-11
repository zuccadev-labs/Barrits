import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "react",
  watch: "auto",
});

export default defineConfig({
  plugins: [react(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});