import * as swc from "@swc/core";

const source1 = "export const A = 1;";
const source2 = `
/**
 * comments
 */
export const B = 2;`;

const r1 = swc.parseSync(source1, { syntax: "typescript", target: "esnext" });
const r2 = swc.parseSync(source2, { syntax: "typescript", target: "esnext" });

console.log("File 1 Span Start:", r1.span.start);
console.log("Node 1 Span Start:", r1.body[0].span.start);

console.log("File 2 Span Start:", r2.span.start);
console.log("Node 2 Span Start:", r2.body[0].span.start);
