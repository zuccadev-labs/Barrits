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