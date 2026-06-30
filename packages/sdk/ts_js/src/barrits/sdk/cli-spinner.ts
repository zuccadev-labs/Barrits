const DEFAULT_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const isDeno = (): boolean => {
  try {
    return typeof Deno !== "undefined" && Deno?.stdout !== undefined;
  } catch {
    return false;
  }
};

const isNode = (): boolean => {
  try {
    return typeof process !== "undefined" && process?.stdout !== undefined;
  } catch {
    return false;
  }
};

const isTerminal = (): boolean => {
  if (isDeno()) {
    try {
      return (Deno as any).stderr?.isTerminal?.() ?? false;
    } catch {
      return false;
    }
  }
  if (isNode()) {
    return process?.stderr?.isTTY ?? false;
  }
  return false;
};

export class BarritsSpinner {
  private frames: string[];
  private interval: number;
  private currentFrame = 0;
  private timer: ReturnType<typeof setInterval> | undefined;
  private text = "";
  private _isSpinning = false;

  constructor(frames: string[] = DEFAULT_FRAMES, interval = 80) {
    this.frames = frames;
    this.interval = interval;
  }

  get isSpinning(): boolean {
    return this._isSpinning;
  }

  private writeStderr(text: string): void {
    if (isDeno()) {
      const encoder = new TextEncoder();
      try {
        (Deno as any).stderr?.writeSync?.(encoder.encode(text));
      } catch {
        /** ignore */
      }
      return;
    }
    if (isNode()) {
      try {
        process?.stderr?.write(text);
      } catch {
        /** ignore */
      }
      return;
    }
  }

  private render(): void {
    this.writeStderr(`\r${this.frames[this.currentFrame]} ${this.text}`);
  }

  private clearLine(): void {
    this.writeStderr("\r\x1b[K");
  }

  start(text: string): void {
    if (this._isSpinning) {
      return;
    }
    this.text = text;
    this._isSpinning = true;

    if (!isTerminal()) {
      this.writeStderr(`${text}\n`);
      return;
    }

    this.timer = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.render();
    }, this.interval);
    this.render();
  }

  update(text: string): void {
    this.text = text;
    if (this._isSpinning && isTerminal()) {
      this.render();
    } else if (this._isSpinning && !isTerminal()) {
      this.writeStderr(`${text}\n`);
    }
  }

  succeed(text?: string): void {
    this.stopWithFinal(text ?? this.text, "✔");
  }

  fail(text?: string): void {
    this.stopWithFinal(text ?? this.text, "✖");
  }

  private stopWithFinal(text: string, symbol: string): void {
    if (!this._isSpinning) {
      return;
    }
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this._isSpinning = false;

    if (isTerminal()) {
      this.clearLine();
      this.writeStderr(`${symbol} ${text}\n`);
    } else {
      this.writeStderr(`${symbol} ${text}\n`);
    }
  }

  stopAndClear(): void {
    if (!this._isSpinning) {
      return;
    }
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this._isSpinning = false;

    if (isTerminal()) {
      this.clearLine();
    }
  }
}
