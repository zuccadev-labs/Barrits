export declare class BarritsSpinner {
    private frames;
    private interval;
    private currentFrame;
    private timer;
    private text;
    private _isSpinning;
    constructor(frames?: string[], interval?: number);
    get isSpinning(): boolean;
    private writeStderr;
    private render;
    private clearLine;
    start(text: string): void;
    update(text: string): void;
    succeed(text?: string): void;
    fail(text?: string): void;
    private stopWithFinal;
    stopAndClear(): void;
}
