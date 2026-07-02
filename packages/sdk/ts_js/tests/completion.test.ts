import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { generateCompletionScript, printCompletion } from "../src/barrits/sdk/completion";

describe("generateCompletionScript", () => {
  it("returns bash completion script for 'bash'", () => {
    const script = generateCompletionScript("bash");
    assert.match(script, /_barrits_completion/);
    assert.match(script, /complete -F _barrits_completion barrits brt/);
    assert.match(script, /COMPREPLY/);
    assert.match(script, /detect/);
    assert.match(script, /info/);
    assert.match(script, /watch/);
    assert.match(script, /dev/);
    assert.match(script, /imports/);
    assert.match(script, /build/);
    assert.match(script, /help/);
    assert.match(script, /completion/);
  });

  it("bash script includes option flags", () => {
    const script = generateCompletionScript("bash");
    assert.match(script, /--json/);
    assert.match(script, /--write/);
    assert.match(script, /--write-snapshot/);
    assert.match(script, /--target/);
    assert.match(script, /--snapshot/);
    assert.match(script, /--domain/);
    assert.match(script, /--export/);
    assert.match(script, /--kind/);
    assert.match(script, /--file-kind/);
    assert.match(script, /--visibility/);
    assert.match(script, /--mode/);
    assert.match(script, /--help/);
  });

  it("bash script includes kind values", () => {
    const script = generateCompletionScript("bash");
    assert.match(script, /named-import/);
    assert.match(script, /namespace-access/);
    assert.match(script, /alias-namespace-access/);
  });

  it("returns zsh completion script for 'zsh'", () => {
    const script = generateCompletionScript("zsh");
    assert.match(script, /#compdef barrits brt/);
    assert.match(script, /_barrits_commands/);
    assert.match(script, /_barrits\(\)/);
    assert.match(script, /_compdef _barrits barrits brt/);
  });

  it("zsh script includes command descriptions", () => {
    const script = generateCompletionScript("zsh");
    assert.match(script, /detect:Detect barrits directory/);
    assert.match(script, /info:Show integration graph overview/);
    assert.match(script, /watch:Watch barrits directory for changes/);
    assert.match(script, /dev:Start dev session with child process/);
    assert.match(script, /imports:Generate and manage import actions/);
    assert.match(script, /build:Generate build manifest/);
    assert.match(script, /help:Show help text/);
    assert.match(script, /completion:Generate shell completion script/);
  });

  it("zsh script includes option flags for commands", () => {
    const script = generateCompletionScript("zsh");
    assert.match(script, /--json\[Output as JSON\]/);
    assert.match(script, /--domain\[Filter by domain\]:domain/);
    assert.match(script, /--export\[Filter by export\]:export/);
    assert.match(script, /--file-kind\[Filter by file kind\]:kind/);
    assert.match(script, /--visibility\[Filter by visibility\]:visibility/);
    assert.match(script, /--kind\[Filter by import kind\]:kind/);
    assert.match(script, /--help\[Show help\]/);
  });

  it("zsh script includes imports-specific flags", () => {
    const script = generateCompletionScript("zsh");
    assert.match(script, /--write\[Write imports to disk\]/);
    assert.match(script, /--target\[Target file\]:target/);
    assert.match(script, /--mode\[Import mode\]:mode/);
  });

  it("zsh script handles completion and help subcommands", () => {
    const script = generateCompletionScript("zsh");
    assert.match(script, /completion\)/);
    assert.match(script, /shell:\(bash zsh fish\)/);
  });

  it("returns fish completion script for 'fish'", () => {
    const script = generateCompletionScript("fish");
    assert.match(script, /complete -c barrits/);
    assert.match(script, /complete -c brt/);
    assert.match(script, /__fish_use_subcommand/);
  });

  it("fish script includes all commands", () => {
    const script = generateCompletionScript("fish");
    assert.match(script, /detect/);
    assert.match(script, /info/);
    assert.match(script, /watch/);
    assert.match(script, /dev/);
    assert.match(script, /imports/);
    assert.match(script, /build/);
    assert.match(script, /help/);
    assert.match(script, /completion/);
  });

  it("fish script includes option flags per command", () => {
    const script = generateCompletionScript("fish");
    assert.match(script, /-l json/);
    assert.match(script, /-l domain/);
    assert.match(script, /-l export/);
    assert.match(script, /-l file-kind/);
    assert.match(script, /-l visibility/);
    assert.match(script, /-l help/);
  });

  it("fish script includes imports and watch/dev specific flags", () => {
    const script = generateCompletionScript("fish");
    assert.match(script, /-l write/);
    assert.match(script, /-l target/);
    assert.match(script, /-l write-snapshot/);
    assert.match(script, /-l snapshot/);
  });

  it("fish script includes completion shell values", () => {
    const script = generateCompletionScript("fish");
    assert.match(script, /bash zsh fish/);
  });

  it("returns error message for unknown shell", () => {
    const result = generateCompletionScript("unknown");
    assert.match(result, /Supported shells: bash, zsh, fish/);
  });

  it("returns error message for empty shell", () => {
    const result = generateCompletionScript("");
    assert.match(result, /Supported shells: bash, zsh, fish/);
  });

  it("is case sensitive - uppercase BASH returns error", () => {
    const result = generateCompletionScript("BASH");
    assert.match(result, /Supported shells: bash, zsh, fish/);
  });

  it("is case sensitive - uppercase ZSH returns error", () => {
    const result = generateCompletionScript("ZSH");
    assert.match(result, /Supported shells: bash, zsh, fish/);
  });

  it("is case sensitive - uppercase FISH returns error", () => {
    const result = generateCompletionScript("FISH");
    assert.match(result, /Supported shells: bash, zsh, fish/);
  });
});

describe("printCompletion", () => {
  it("prints bash completion to console", () => {
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };

    try {
      printCompletion("bash");
      assert.equal(lines.length, 1);
      assert.match(lines[0], /_barrits_completion/);
      assert.match(lines[0], /complete -F _barrits_completion barrits brt/);
    } finally {
      console.log = originalLog;
    }
  });

  it("prints zsh completion to console", () => {
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };

    try {
      printCompletion("zsh");
      assert.equal(lines.length, 1);
      assert.match(lines[0], /#compdef barrits brt/);
      assert.match(lines[0], /_compdef _barrits barrits brt/);
    } finally {
      console.log = originalLog;
    }
  });

  it("prints fish completion to console", () => {
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };

    try {
      printCompletion("fish");
      assert.equal(lines.length, 1);
      assert.match(lines[0], /complete -c barrits/);
      assert.match(lines[0], /complete -c brt/);
    } finally {
      console.log = originalLog;
    }
  });

  it("prints error message for unknown shell", () => {
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.map(String).join(" ")); };

    try {
      printCompletion("unknown");
      assert.equal(lines.length, 1);
      assert.match(lines[0], /Supported shells: bash, zsh, fish/);
    } finally {
      console.log = originalLog;
    }
  });

  it("restores console.log after printing", () => {
    const originalLog = console.log;
    console.log = () => {};

    try {
      printCompletion("bash");
    } finally {
      console.log = originalLog;
    }

    assert.equal(console.log, originalLog);
  });
});
