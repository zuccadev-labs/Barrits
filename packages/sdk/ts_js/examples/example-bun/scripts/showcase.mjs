import { createOperationalShowcase } from "../src/examples/index.mjs";

const showcase = await createOperationalShowcase();

console.log(JSON.stringify(showcase, null, 2));
