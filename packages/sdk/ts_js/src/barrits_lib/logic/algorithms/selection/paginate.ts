import { toPositiveInteger } from "../internal/normalize";

/**
 * [EN] Pagination request: 1-indexed page and page size.
 * [ES] Solicitud de paginación: página basada en 1 y tamaño de página.
 */
export type PaginationOptions = {
  /** [EN] Page number (1-indexed). [ES] Número de página (basado en 1). */
  readonly page: number;
  /** [EN] Number of items per page. [ES] Número de elementos por página. */
  readonly pageSize: number;
};

/**
 * [EN] Page slice plus navigation metadata.
 * [ES] Porción de página más metadatos de navegación.
 */
export type PaginatedResult<Value> = {
  /** [EN] Items for the current page. [ES] Elementos de la página actual. */
  readonly items: readonly Value[];
  /** [EN] Current page number. [ES] Número de página actual. */
  readonly page: number;
  /** [EN] Number of items per page. [ES] Número de elementos por página. */
  readonly pageSize: number;
  /** [EN] Total number of items across all pages. [ES] Número total de elementos en todas las páginas. */
  readonly totalItems: number;
  /** [EN] Total number of pages (at least 1). [ES] Número total de páginas (al menos 1). */
  readonly totalPages: number;
  /** [EN] Whether there is a next page. [ES] Indica si hay una página siguiente. */
  readonly hasNextPage: boolean;
  /** [EN] Whether there is a previous page. [ES] Indica si hay una página anterior. */
  readonly hasPreviousPage: boolean;
};

/**
 * [EN] Paginates a collection. `page` is clamped to `[1, totalPages]` and `pageSize` to a positive integer;
 * `NaN`, `Infinity` or non-numeric inputs fall back to page 1 / size 1 instead of leaking into the result.
 * [ES] Pagina una colección. `page` se acota a `[1, totalPages]` y `pageSize` a un entero positivo; `NaN`,
 * `Infinity` o entradas no numéricas caen a página 1 / tamaño 1 en lugar de filtrarse al resultado.
 *
 * @param values [EN] Collection to paginate. [ES] Colección a paginar.
 * @param options [EN] Pagination settings (page, pageSize). [ES] Configuración de paginación.
 * @returns [EN] Paginated metadata and item slice. [ES] Metadatos de paginación y porción de elementos.
 */
export const paginate = <Value>(values: readonly Value[], options: PaginationOptions): PaginatedResult<Value> => {
  const pageSize = toPositiveInteger(options.pageSize, 1);
  const totalItems = values.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(toPositiveInteger(options.page, 1), totalPages);
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
