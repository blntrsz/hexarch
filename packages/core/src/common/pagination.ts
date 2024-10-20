import { z } from "zod";

export const PaginatedOptions = z.object({
  pageSize: z.number(),
  pageNumber: z.number(),
});
export type PaginatedOptions = z.infer<typeof PaginatedOptions>;

export type Paginated<T> = {
  data: Readonly<T[]>;
  hasNextPage: boolean;
} & PaginatedOptions;
