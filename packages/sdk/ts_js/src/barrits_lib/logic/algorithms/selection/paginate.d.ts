export type PaginationOptions = {
    readonly page: number;
    readonly pageSize: number;
};
export type PaginatedResult<Value> = {
    readonly items: Value[];
    readonly page: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
};
export declare const paginate: <Value>(values: readonly Value[], options: PaginationOptions) => PaginatedResult<Value>;
