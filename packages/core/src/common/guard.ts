import { z } from "zod";

export namespace Guard {
  export function parseSchema<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    data: z.infer<TSchema>,
  ) {
    return schema.parse(data);
  }
}
