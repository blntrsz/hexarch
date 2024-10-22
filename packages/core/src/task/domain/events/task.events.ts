import { randomUUID } from "node:crypto";

import { Task } from "../entities/task.entity";

export namespace TaskEvent {
  export const created = "TaskCreated:1";
  export function getCreated(current: Task.Info) {
    return Object.freeze({
      name: created,
      data: {
        current,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }

  export const updated = "TaskUpdated:1";
  export function getUpdated(previous: Task.Info, current: Task.Info) {
    return Object.freeze({
      name: updated,
      data: {
        previous,
        current,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }

  export const deleted = "TaskDeleted:1";
  export function getDeleted(previous: Task.Info) {
    return Object.freeze({
      name: deleted,
      data: {
        previous,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}
