import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NodeFileSystemAdapter, createRuntimeFileSystemAdapter } from "../src/barrits/sdk/adapters";
import type { RuntimeFileSystemAdapter } from "../src/barrits/sdk/contracts";

test("createRuntimeFileSystemAdapter returns a NodeFileSystemAdapter in Node.js", () => {
  const adapter = createRuntimeFileSystemAdapter();
  assert.ok(adapter instanceof NodeFileSystemAdapter);
});

test("NodeFileSystemAdapter.cwd returns a non-empty string", async () => {
  const adapter = new NodeFileSystemAdapter();
  const cwd = await adapter.cwd();
  assert.ok(typeof cwd === "string");
  assert.ok(cwd.length > 0);
});

test("NodeFileSystemAdapter.directoryExists returns true for existing directory", async () => {
  const adapter = new NodeFileSystemAdapter();
  const exists = await adapter.directoryExists(process.cwd());
  assert.equal(exists, true);
});

test("NodeFileSystemAdapter.directoryExists returns false for non-existing directory", async () => {
  const adapter = new NodeFileSystemAdapter();
  const exists = await adapter.directoryExists(join(process.cwd(), "nonexistent-directory-12345"));
  assert.equal(exists, false);
});

test("NodeFileSystemAdapter.directoryExists returns false for a file path", async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), "barrits-adapter-is-not-dir-"));
  const filePath = join(tmpDir, "test.txt");
  await writeFile(filePath, "content", "utf-8");

  const adapter = new NodeFileSystemAdapter();
  const exists = await adapter.directoryExists(filePath);
  assert.equal(exists, false);
});

test("NodeFileSystemAdapter.listEntries returns entries for existing directory", async () => {
  const adapter = new NodeFileSystemAdapter();
  const entries = await adapter.listEntries(process.cwd());
  assert.ok(Array.isArray(entries));
  assert.ok(entries.length > 0);
  assert.ok(entries.every((e) => typeof e.name === "string" && typeof e.type === "string"));
});

test("NodeFileSystemAdapter.listEntries throws for non-existing directory", async () => {
  const adapter = new NodeFileSystemAdapter();
  await assert.rejects(
    () => adapter.listEntries(join(process.cwd(), "nonexistent-xyz-987")),
    /ENOENT/,
  );
});

test("NodeFileSystemAdapter.listDirectories returns subdirectories", async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), "barrits-adapter-test-"));
  try {
    await mkdir(join(tmpDir, "subdir-a"));
    await mkdir(join(tmpDir, "subdir-b"));
    await writeFile(join(tmpDir, "file.txt"), "hello");

    const adapter = new NodeFileSystemAdapter();
    const dirs = await adapter.listDirectories(tmpDir);
    assert.deepEqual(dirs.sort(), ["subdir-a", "subdir-b"]);
  } finally {
    // cleanup not required for test temp dirs
  }
});

test("NodeFileSystemAdapter.readTextFile reads file content", async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), "barrits-adapter-read-"));
  const filePath = join(tmpDir, "test.txt");
  const content = "hello barrits";
  await writeFile(filePath, content, "utf-8");

  const adapter = new NodeFileSystemAdapter();
  const result = await adapter.readTextFile(filePath);
  assert.equal(result, content);
});

test("NodeFileSystemAdapter.readTextFile throws for non-existing file", async () => {
  const adapter = new NodeFileSystemAdapter();
  await assert.rejects(
    () => adapter.readTextFile(join(process.cwd(), "nonexistent-file-xyz.txt")),
    /ENOENT/,
  );
});

test("adapter interface contract is satisfied by NodeFileSystemAdapter", () => {
  const adapter: RuntimeFileSystemAdapter = new NodeFileSystemAdapter();
  assert.ok(typeof adapter.cwd === "function");
  assert.ok(typeof adapter.directoryExists === "function");
  assert.ok(typeof adapter.listDirectories === "function");
  assert.ok(typeof adapter.listEntries === "function");
  assert.ok(typeof adapter.readTextFile === "function");
});
