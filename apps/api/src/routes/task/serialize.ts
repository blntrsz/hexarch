import { Task } from "@hexarch/core/domain/entities/task.entity";
import { ZodTypeAny } from "zod";

export function serializeTask<TSchema extends ZodTypeAny>(
  task: Task.Entity,
  schema: TSchema,
) {
  return schema.parse({
    id: task.id,
    type: Task.brand,
    attributes: {
      title: task.title,
      status: task.status,
      updated_at: task.updatedAt.toISOString(),
      created_at: task.createdAt.toISOString(),
    },
  });
}
