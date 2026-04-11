import { createOperationalShowcase } from "./examples/index.mjs";

export const boot = () => {
  return createOperationalShowcase();
};

export const showcase = boot();