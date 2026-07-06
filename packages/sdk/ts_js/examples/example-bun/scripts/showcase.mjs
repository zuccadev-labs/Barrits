import { createOperationalShowcase } from "../src/examples/index.mjs";

const showcase = createOperationalShowcase();

console.log(JSON.stringify(showcase, null, 2));
