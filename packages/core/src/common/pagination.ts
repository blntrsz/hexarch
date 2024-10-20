export type PaginatedOptions = {
  pageSize: number;
  pageNumber: number;
};

export type Paginated<T> = {
  data: Readonly<T[]>;
  hasNextPage: boolean;
} & PaginatedOptions;
