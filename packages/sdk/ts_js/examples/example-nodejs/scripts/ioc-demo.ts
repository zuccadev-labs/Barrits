import { BarritsIoCContainer } from "@zuccadev-labs/barrits/ioc";
import type { BarritsBuildManifest } from "@zuccadev-labs/barrits";

type Config = { port: number; env: string };
type Logger = { info: (msg: string) => void };
type UserService = { list: () => string[]; add: (name: string) => void };

const manifest: BarritsBuildManifest = {
  generatedAt: new Date().toISOString(),
  checksum: "sha256-mock",
  projectRoot: process.cwd(),
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

container.register<UserService>("user:crud", async (c) => {
  const users: string[] = [];
  return {
    list: () => [...users],
    add: async (name: string) => {
      users.push(name);
      const logger = await c.resolve<Logger>("logger");
      logger.info(`user added: ${name}`);
    },
  };
});

await container.wire();

const config = await container.resolve<Config>("config");
const users = await container.resolve<UserService>("user:crud");

console.log(`Config: port=${config.port}, env=${config.env}`);
await users.add("Alice");
await users.add("Bob");
console.log("Users:", users.list().join(", "));
