import { describe, expect, test } from "bun:test";
import { run } from "./helpers/setup";

describe("main.ts entrypoint", () => {
  test("runs successfully", () => {
    const output = run("src/main.ts");
    expect(output).toBeDefined();
  });
});
