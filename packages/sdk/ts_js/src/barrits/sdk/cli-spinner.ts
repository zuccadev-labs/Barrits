const DEFAULT_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const textEncoder = new TextEncoder();

const getDenoNamespace = (): unknown | undefined => {
  return (globalThis as Record<string, unknown>).Deno;
};

const isDeno = (): boolean => {
  try {
    const deno = getDenoNamespace();
    const stdout = (deno as Record<string, unknown> | undefined)?.stdout;
    return stdout !== undefined;
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
      const stderr = (getDenoNamespace() as Record<string, unknown>).stderr as Record<string, unknown> | undefined;
      const isTerminalFn = stderr?.isTerminal as (() => boolean) | undefined;
      return isTerminalFn?.() ?? false;
    } catch {
      return false;
    }
  }
  if (isNode()) {
    return process?.stderr?.isTTY ?? false;
  }
  return false;
};

/**
 * [EN] A terminal spinner widget for long-running CLI tasks (supports Deno and Node runtimes).
 * [ES] Un widget de spinner de terminal para tareas CLI de larga duración (soporta runtimes Deno y Node).
 */
export class BarritsSpinner {
  private frames: string[];
  private interval: number;
  private currentFrame = 0;
  private timer: ReturnType<typeof setInterval> | undefined;
  private text = "";
  private _isSpinning = false;

  /**
   * [EN] Creates a new BarritsSpinner with optional custom frames and interval.
   * [ES] Crea un nuevo BarritsSpinner con frames e intervalo opcionales personalizados.
   */
  constructor(frames: string[] = DEFAULT_FRAMES, interval = 80) {
    this.frames = frames;
    this.interval = interval;
  }

  /**
   * [EN] Returns whether the spinner is currently animating.
   * [ES] Retorna si el spinner está actualmente animando.
   */
  get isSpinning(): boolean {
    return this._isSpinning;
  }

  private writeStderr(text: string): void {
    try {
      if (isDeno()) {
        const denoStderr = (getDenoNamespace() as Record<string, unknown>).stderr as { writeSync?: (data: Uint8Array) => void } | undefined;
        denoStderr?.writeSync?.(textEncoder.encode(text));
        return;
      }
      if (isNode()) {
        process?.stderr?.write(text);
        return;
      }
    } catch {
      /** ignore stderr write failures (e.g. closed pipe) */
    }
  }

  private render(): void {
    this.writeStderr(`\r${this.frames[this.currentFrame]} ${this.text}`);
  }

  private clearLine(): void {
    this.writeStderr("\r\x1b[K");
  }

  /**
   * [EN] Starts the spinner animation with the given text.
   * [ES] Inicia la animación del spinner con el texto indicado.
   */
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

  /**
   * [EN] Updates the displayed text while the spinner is active.
   * [ES] Actualiza el texto mostrado mientras el spinner está activo.
   */
  update(text: string): void {
    this.text = text;
    if (this._isSpinning && isTerminal()) {
      this.render();
    } else if (this._isSpinning && !isTerminal()) {
      this.writeStderr(`${text}\n`);
    }
  }

  /**
   * [EN] Stops the spinner with a success symbol.
   * [ES] Detiene el spinner con un símbolo de éxito.
   */
  succeed(text?: string): void {
    this.stopWithFinal(text ?? this.text, "✔");
  }

  /**
   * [EN] Stops the spinner with a failure symbol.
   * [ES] Detiene el spinner con un símbolo de fallo.
   */
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

  /**
   * [EN] Stops the spinner and clears the line without a final symbol.
   * [ES] Detiene el spinner y limpia la línea sin un símbolo final.
   */
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
