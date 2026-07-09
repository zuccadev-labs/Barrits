import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export type QueueItem = { id: string; task: string; priority: number };
export type QueueService = {
  list: () => QueueItem[];
  enqueue: (item: Omit<QueueItem, "id">) => QueueItem;
  dequeue: (id: string) => boolean;
};

export const queueServiceTrait = createTraitDescriptor({
  name: "queue-service",
  provides: ["queue:crud"],
  state: { items: { type: "array", items: { type: "object" } } },
  create: () => {
    const items: QueueItem[] = [];
    let nextId = 1;
    return {
      list: () => [...items],
      enqueue: (item: Omit<QueueItem, "id">) => {
        const newItem: QueueItem = { id: String(nextId++), ...item };
        items.push(newItem);
        return newItem;
      },
      dequeue: (id: string) => {
        const idx = items.findIndex((i) => i.id === id);
        if (idx === -1) return false;
        items.splice(idx, 1);
        return true;
      },
    };
  },
});
