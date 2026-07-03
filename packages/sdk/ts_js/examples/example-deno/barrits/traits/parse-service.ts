import { createTraitDescriptor } from "../../../../dist/adapters/deno/mod.js";

export type ParseUser = { objectId: string; username: string; role: string };
export type ParseService = {
  list: () => ParseUser[];
  get: (id: string) => ParseUser | undefined;
  create: (user: Omit<ParseUser, "objectId">) => ParseUser;
  remove: (id: string) => boolean;
};

export const parseServiceTrait = createTraitDescriptor({
  name: "parse-service",
  provides: ["parse:crud"],
  state: { users: { type: "array", items: { type: "object" } } },
  create: () => {
    const users: ParseUser[] = [];
    return {
      list: () => [...users],
      get: (id: string) => users.find((u) => u.objectId === id),
      create: (user: Omit<ParseUser, "objectId">) => {
        const newUser: ParseUser = { objectId: crypto.randomUUID(), ...user };
        users.push(newUser);
        return newUser;
      },
      remove: (id: string) => {
        const idx = users.findIndex((u) => u.objectId === id);
        if (idx === -1) return false;
        users.splice(idx, 1);
        return true;
      },
    };
  },
});
