export declare const mapConcurrent: <T, U>(items: readonly T[], concurrency: number, fn: (item: T, index: number) => Promise<U>) => Promise<U[]>;
