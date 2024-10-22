import { z } from "zod";
import { randomUUID } from "node:crypto";

import { Guard } from "#common/guard.js";

export namespace Task {
  export const brand = "tasks" as const;

  export type Info = z.infer<typeof Info>;
  export const Info = z.object({
    id: z.string().uuid(),
    title: z.string(),
    status: z.enum(["to_do", "in_progress", "done"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

  export type Entity = z.infer<typeof Entity>;
  export const Entity = Info.brand<typeof brand>().readonly();

  export function create(properties: Pick<Entity, "title">): Entity {
    const now = new Date();

    return Guard.parseSchema(Entity, {
      id: randomUUID(),
      title: properties.title,
      status: "to_do",
      updatedAt: now,
      createdAt: now,
    } as Entity);
  }

  export function update(
    previousEntity: Entity,
    {
      title = previousEntity.title,
      status = previousEntity.status,
    }: Partial<Pick<Entity, "title" | "status">>,
  ): Entity {
    const now = new Date();

    return Guard.parseSchema(Entity, {
      ...structuredClone(previousEntity),
      title,
      status,
      updatedAt: now,
    } as Entity);
  }
}
