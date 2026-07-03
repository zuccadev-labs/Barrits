import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import { DefaultBarritsLogger, logger } from "../src/barrits/sdk/logger";

describe("DefaultBarritsLogger", () => {
  it("defaults level to 'info'", () => {
    const log = new DefaultBarritsLogger();
    assert.equal(log.level, "info");
  });

  it("accepts custom level via constructor", () => {
    const log = new DefaultBarritsLogger("debug");
    assert.equal(log.level, "debug");
  });

  it("logs debug when level is debug", () => {
    const log = new DefaultBarritsLogger("debug");
    const calls: string[] = [];
    mock.method(console, "debug", (msg: string) => { calls.push(msg); });

    log.debug("test debug");
    assert.equal(calls.length, 1);
    assert.match(calls[0], /\[BARRITS\] \[DEBUG\] test debug/);
    mock.restoreAll();
  });

  it("does not log debug when level is info", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: string[] = [];
    mock.method(console, "debug", (msg: string) => { calls.push(msg); });

    log.debug("should not appear");
    assert.equal(calls.length, 0);
    mock.restoreAll();
  });

  it("does not log debug when level is warn", () => {
    const log = new DefaultBarritsLogger("warn");
    const calls: string[] = [];
    mock.method(console, "debug", (msg: string) => { calls.push(msg); });

    log.debug("should not appear");
    assert.equal(calls.length, 0);
    mock.restoreAll();
  });

  it("does not log anything when level is off", () => {
    const log = new DefaultBarritsLogger("off");
    const calls: string[] = [];
    mock.method(console, "info", (msg: string) => { calls.push(msg); });
    mock.method(console, "warn", (msg: string) => { calls.push(msg); });
    mock.method(console, "error", (msg: string) => { calls.push(msg); });

    log.info("nope");
    log.warn("nope");
    log.error("nope");
    assert.equal(calls.length, 0);
    mock.restoreAll();
  });

  it("logs info when level is info", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: string[] = [];
    mock.method(console, "info", (msg: string) => { calls.push(msg); });

    log.info("test info");
    assert.equal(calls.length, 1);
    assert.match(calls[0], /\[BARRITS\] \[INFO\] test info/);
    mock.restoreAll();
  });

  it("does not log info when level is warn", () => {
    const log = new DefaultBarritsLogger("warn");
    const calls: string[] = [];
    mock.method(console, "info", (msg: string) => { calls.push(msg); });

    log.info("should not appear");
    assert.equal(calls.length, 0);
    mock.restoreAll();
  });

  it("logs warn when level is warn", () => {
    const log = new DefaultBarritsLogger("warn");
    const calls: string[] = [];
    mock.method(console, "warn", (msg: string) => { calls.push(msg); });

    log.warn("test warn");
    assert.equal(calls.length, 1);
    assert.match(calls[0], /\[BARRITS\] \[WARN\] test warn/);
    mock.restoreAll();
  });

  it("logs warn when level is info", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: string[] = [];
    mock.method(console, "warn", (msg: string) => { calls.push(msg); });

    log.warn("test warn");
    assert.equal(calls.length, 1);
    mock.restoreAll();
  });

  it("logs error when level is error", () => {
    const log = new DefaultBarritsLogger("error");
    const calls: string[] = [];
    mock.method(console, "error", (msg: string) => { calls.push(msg); });

    log.error("test error");
    assert.equal(calls.length, 1);
    assert.match(calls[0], /\[BARRITS\] \[ERROR\] test error/);
    mock.restoreAll();
  });

  it("logs error when level is info", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: string[] = [];
    mock.method(console, "error", (msg: string) => { calls.push(msg); });

    log.error("test error");
    assert.equal(calls.length, 1);
    mock.restoreAll();
  });

  it("forwards extra args to console methods", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: unknown[][] = [];
    mock.method(console, "info", (msg: string, ...args: unknown[]) => { calls.push([msg, ...args]); });

    log.info("value is", 42, { key: "val" });
    assert.equal(calls.length, 1);
    assert.match(calls[0][0] as string, /value is/);
    assert.equal(calls[0][1], 42);
    assert.deepEqual(calls[0][2], { key: "val" });
    mock.restoreAll();
  });

  it("includes timestamp in format", () => {
    const log = new DefaultBarritsLogger("info");
    const calls: string[] = [];
    mock.method(console, "info", (msg: string) => { calls.push(msg); });

    log.info("msg");
    assert.match(calls[0], /^\[\d{4}-\d{2}-\d{2}T/);
    mock.restoreAll();
  });
});

describe("logger singleton", () => {
  it("is a DefaultBarritsLogger instance", () => {
    assert.ok(logger instanceof DefaultBarritsLogger);
  });

  it("has default level info", () => {
    assert.equal(logger.level, "info");
  });
});
