export type Paginated<T> = {
  data: T[];
  pageSize: number;
  pageNumber: number;
  hasNextPage: boolean;
};
