import test from "node:test";
import assert from "node:assert/strict";
import { BarritsSpinner } from "../src/barrits/sdk/cli-spinner";

const suppressStderr = <TResult>(fn: () => TResult): TResult => {
  const originalWrite = process.stderr.write;
  process.stderr.write = () => true;
  try { return fn(); } finally { process.stderr.write = originalWrite; }
};

const captureStderr = <TResult>(fn: () => TResult): { result: TResult; output: string } => {
  const chunks: string[] = [];
  const originalWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = (chunk: unknown) => { chunks.push(String(chunk)); return true; };
  try {
    const result = fn();
    return { result, output: chunks.join("") };
  } finally {
    process.stderr.write = originalWrite;
  }
};

test("BarritsSpinner starts with isSpinning false", () => {
  const spinner = new BarritsSpinner();
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.start sets isSpinning true", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("loading"));
  assert.equal(spinner.isSpinning, true);
});

test("BarritsSpinner.start is idempotent", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => {
    spinner.start("loading");
    spinner.start("again");
  });
  assert.equal(spinner.isSpinning, true);
});

test("BarritsSpinner.succeed sets isSpinning false", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => {
    spinner.start("loading");
    spinner.succeed();
  });
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.fail sets isSpinning false", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => {
    spinner.start("loading");
    spinner.fail();
  });
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.stopAndClear sets isSpinning false", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => {
    spinner.start("loading");
    spinner.stopAndClear();
  });
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.succeed is no-op when not started", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.succeed());
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.fail is no-op when not started", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.fail());
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.stopAndClear is no-op when not started", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.stopAndClear());
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.update does not throw", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => {
    spinner.start("loading");
    spinner.update("progress");
    spinner.update("almost done");
    spinner.succeed();
  });
  assert.equal(spinner.isSpinning, false);
});

test("BarritsSpinner.succeed prints ✔ symbol", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("test"));
  const { output } = captureStderr(() => spinner.succeed());
  assert.ok(output.includes("✔"), `expected ✔ in output, got: ${JSON.stringify(output)}`);
});

test("BarritsSpinner.fail prints ✖ symbol", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("test"));
  const { output } = captureStderr(() => spinner.fail());
  assert.ok(output.includes("✖"), `expected ✖ in output, got: ${JSON.stringify(output)}`);
});

test("BarritsSpinner.succeed with custom text", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("old"));
  const { output } = captureStderr(() => spinner.succeed("done!"));
  assert.ok(output.includes("done!"), `expected "done!" in output, got: ${JSON.stringify(output)}`);
});

test("BarritsSpinner.fail with custom text", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("working"));
  const { output } = captureStderr(() => spinner.fail("error: timeout"));
  assert.ok(output.includes("error: timeout"), `expected "error: timeout" in output, got: ${JSON.stringify(output)}`);
});

test("BarritsSpinner.stopAndClear clears output without symbol", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("test"));
  const { output } = captureStderr(() => spinner.stopAndClear());
  assert.ok(!output.includes("✔"), `should not contain ✔, got: ${JSON.stringify(output)}`);
  assert.ok(!output.includes("✖"), `should not contain ✖, got: ${JSON.stringify(output)}`);
});

test("BarritsSpinner.succeed uses current text when no argument given", () => {
  const spinner = new BarritsSpinner();
  suppressStderr(() => spinner.start("processing"));
  const { output } = captureStderr(() => spinner.succeed());
  assert.ok(output.includes("processing"), `expected "processing" in output, got: ${JSON.stringify(output)}`);
});
