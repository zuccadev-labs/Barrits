import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export type User = { id: string; name: string; role: string };
export type UserService = {
  list: () => User[];
  get: (id: string) => User | undefined;
  add: (user: User) => void;
  remove: (id: string) => boolean;
};

export const userServiceTrait = createTraitDescriptor({
  name: "user-service",
  provides: ["user:crud"],
  state: { users: { type: "array", items: { type: "object" } } },
  create: () => {
    const users: User[] = [];
    return {
      list: () => [...users],
      get: (id: string) => users.find((u) => u.id === id),
      add: (user: User) => { users.push(user); },
      remove: (id: string) => {
        const idx = users.findIndex((u) => u.id === id);
        if (idx === -1) return false;
        users.splice(idx, 1);
        return true;
      },
    };
  },
});
