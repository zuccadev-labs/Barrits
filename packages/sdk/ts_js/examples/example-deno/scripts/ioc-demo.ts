import { BarritsIoCContainer } from "../../../src/barrits/ioc/index.ts";
import type { BarritsBuildManifest } from "../../../src/barrits/sdk/contracts.ts";

type Config = { port: number; env: string };
type Logger = { info: (msg: string) => void };
type ParseService = { list: () => string[]; create: (name: string) => Promise<string> };

const manifest: BarritsBuildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mock",
  projectRoot: Deno.cwd(),
  barritsDirectory: ".barrits",
  strategy: "current-directory",
  discoveryRoots: [],
  filesCount: 3,
  exportsCount: 3,
  publicExportsCount: 3,
  internalExportsCount: 0,
  barrelsCount: 1,
  domains: ["api"],
  traitDiagnostics: [],
  importActions: [],
  collisions: [],
  traitDescriptors: [],
};

const container = new BarritsIoCContainer(manifest);

container.register<Config>("config", () => ({ port: 3000, env: "development" }));

container.register<Logger>("logger", async (c) => {
  const config = await c.resolve<Config>("config");
  return { info: (msg: string) => console.log(`[${config.env}] ${msg}`) };
});

container.register<ParseService>("parse:crud", async (c) => {
  let nextId = 1;
  const items: string[] = [];
  return {
    list: () => [...items],
    create: async (name: string) => {
      const id = `obj_${nextId++}`;
      items.push(name);
      const logger = await c.resolve<Logger>("logger");
      logger.info(`object created: ${name} (${id})`);
      return id;
    },
  };
});

await container.wire();

const config = await container.resolve<Config>("config");
const parseService = await container.resolve<ParseService>("parse:crud");

console.log(`Config: port=${config.port}, env=${config.env}`);
const id1 = await parseService.create("Alice");
const id2 = await parseService.create("Bob");
console.log("Objects:", parseService.list().join(", "));
