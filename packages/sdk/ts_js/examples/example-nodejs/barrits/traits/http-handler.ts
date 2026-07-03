import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export const httpHandlerTrait = createTraitDescriptor({
  name: "http-handler",
  provides: ["http:request"],
  tags: ["http-endpoint", "runtime"],
  create: () => ({
    handle: async (req: { method: string; path: string; body?: unknown }) => {
      return { status: 200, body: { ok: true, path: req.path } };
    },
  }),
});
