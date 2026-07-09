/**
 * [EN] Type definition for PaginationOptions.
 * [ES] Definición de tipo para PaginationOptions.
 */
export type PaginationOptions = {
  /** [EN] Page number (1-indexed). [ES] Número de página (basado en 1). */
  readonly page: number;
  /** [EN] Number of items per page. [ES] Número de elementos por página. */
  readonly pageSize: number;
};

/**
 * [EN] Type definition for PaginatedResult.
 * [ES] Definición de tipo para PaginatedResult.
 */
export type PaginatedResult<Value> = {
  /** [EN] Items for the current page. [ES] Elementos de la página actual. */
  readonly items: Value[];
  /** [EN] Current page number. [ES] Número de página actual. */
  readonly page: number;
  /** [EN] Number of items per page. [ES] Número de elementos por página. */
  readonly pageSize: number;
  /** [EN] Total number of items across all pages. [ES] Número total de elementos en todas las páginas. */
  readonly totalItems: number;
  /** [EN] Total number of pages. [ES] Número total de páginas. */
  readonly totalPages: number;
  /** [EN] Whether there is a next page. [ES] Indica si hay una página siguiente. */
  readonly hasNextPage: boolean;
  /** [EN] Whether there is a previous page. [ES] Indica si hay una página anterior. */
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
export const paginate = <Value>(
  values: readonly Value[],
  options: PaginationOptions,
): PaginatedResult<Value> => {
  const pageSize = Math.max(1, Math.floor(options.pageSize));
  const totalItems = values.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(1, Math.floor(options.page)), totalPages);
  const startIndex = (page - 1) * pageSize;

  return {
    items: values.slice(startIndex, startIndex + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};