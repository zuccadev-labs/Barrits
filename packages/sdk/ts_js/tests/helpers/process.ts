import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

export type ProcessResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

export const runCommand = async (
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ProcessResult> => {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      resolvePromise({
        exitCode: code ?? 0,
        stdout,
        stderr,
      });
    });
  });
};

export const spawnCommand = (
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = process.env,
): ChildProcessWithoutNullStreams => {
  return spawn(command, args, {
    cwd,
    shell: false,
    env,
  });
};

export const waitForProcessOutput = async (
  child: ChildProcessWithoutNullStreams,
  matcher: RegExp,
  timeoutMs = 5000,
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolvePromise, reject) => {
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for process output matching ${matcher}`));
    }, timeoutMs);

    const onStdout = (chunk: Buffer): void => {
      stdout += chunk.toString();

      if (matcher.test(stdout) || matcher.test(stderr)) {
        cleanup();
        resolvePromise({ stdout, stderr });
      }
    };

    const onStderr = (chunk: Buffer): void => {
      stderr += chunk.toString();

      if (matcher.test(stdout) || matcher.test(stderr)) {
        cleanup();
        resolvePromise({ stdout, stderr });
      }
    };

    const onExit = (): void => {
      cleanup();
      reject(new Error(`Process exited before emitting output matching ${matcher}`));
    };

    const cleanup = (): void => {
      clearTimeout(timer);
      child.stdout.off("data", onStdout);
      child.stderr.off("data", onStderr);
      child.off("exit", onExit);
    };

    child.stdout.on("data", onStdout);
    child.stderr.on("data", onStderr);
    child.on("exit", onExit);
  });
};

export const waitForProcessExit = async (
  child: ChildProcessWithoutNullStreams,
  timeoutMs = 5000,
): Promise<ProcessResult> => {
  return new Promise((resolvePromise, reject) => {
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out waiting for process exit"));
    }, timeoutMs);

    const onStdout = (chunk: Buffer): void => {
      stdout += chunk.toString();
    };

    const onStderr = (chunk: Buffer): void => {
      stderr += chunk.toString();
    };

    const onExit = (code: number | null): void => {
      cleanup();
      resolvePromise({
        exitCode: code ?? 0,
        stdout,
        stderr,
      });
    };

    const cleanup = (): void => {
      clearTimeout(timer);
      child.stdout.off("data", onStdout);
      child.stderr.off("data", onStderr);
      child.off("exit", onExit);
    };

    child.stdout.on("data", onStdout);
    child.stderr.on("data", onStderr);
    child.on("exit", onExit);
  });
};
