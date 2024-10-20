import { z } from "zod";
import { randomUUID } from "node:crypto";

import { Guard } from "#common/guard.js";

export namespace Task {
  export const brand = "tasks";
  export enum Status {
    TO_DO = "to_do",
    IN_PROGRESS = "in_progress",
    DONE = "done",
  }

  export type Info = z.infer<typeof Info>;
  export const Info = z.object({
    id: z.string().uuid(),
    title: z.string(),
    status: z.nativeEnum(Status),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  export type Entity = z.infer<typeof Entity>;
  export const Entity = Info.brand<typeof brand>().readonly();

  export function create(properties: Pick<Entity, "title">): Entity {
    const now = new Date();

    return Guard.parseSchema(Entity, {
      id: randomUUID(),
      title: properties.title,
      status: Status.TO_DO,
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
      ...previousEntity,
      title,
      status,
      updatedAt: now,
    } as Entity);
  }
}
