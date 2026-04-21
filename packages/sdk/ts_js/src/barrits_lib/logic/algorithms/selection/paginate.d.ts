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
/**
 * [EN] Paginates a collection of values into a structured result.
 * [ES] Pagina una colección de valores en un resultado estructurado.
 *
 * @param values [EN] Collection to paginate. [ES] Colección a paginar.
 * @param options [EN] Pagination settings (page, pageSize). [ES] Configuración de paginación.
 * @returns [EN] Paginated metadata and item slice. [ES] Metadatos de paginación y porción de elementos.
 */
export declare const paginate: <Value>(values: readonly Value[], options: PaginationOptions) => PaginatedResult<Value>;
