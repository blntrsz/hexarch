import { sql } from "slonik";

import { createRepositorySpan } from "#common/infrastructure/services/aws/observability.js";
import { Paginated, PaginatedOptions } from "#common/pagination.js";
import { Task } from "#task/domain/entities/task.entity.js";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#task/domain/repositories/task.repository.js";

import { ConnectionContext } from "./connection";

class PostgresTaskRepository implements TaskRepository {
  private tableName = "tasks";

  constructor() {}

  async save(entity: Task.Entity): Promise<void> {
    const span = createRepositorySpan(
      PostgresTaskRepository.name,
      this.save.name,
    );

    return span(async () => {
      const pool = await ConnectionContext.use().get();

      await pool.query(sql.unsafe`
      INSERT INTO ${sql.identifier([this.tableName])} (id, title, status, created_at, updated_at)
      VALUES (
        ${entity.id},
        ${entity.title},
        ${entity.status},
        ${sql.timestamp(entity.createdAt)},
        ${sql.timestamp(entity.updatedAt)}
      ) 
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `);
    });
  }

  async delete(entity: Task.Entity): Promise<void> {
    const span = createRepositorySpan(
      PostgresTaskRepository.name,
      this.delete.name,
    );

    return span(async () => {
      const pool = await ConnectionContext.use().get();

      await pool.query(sql.unsafe`
      DELETE FROM ${sql.identifier([this.tableName])}
      WHERE id = ${entity.id};
    `);
    });
  }

  async findOne(id: Task.Entity["id"]): Promise<Task.Entity> {
    const span = createRepositorySpan(
      PostgresTaskRepository.name,
      this.findOne.name,
    );

    return span(async () => {
      const pool = await ConnectionContext.use().get();

      return pool.one(sql.type(Task.Entity)`
      SELECT * FROM ${sql.identifier([this.tableName])}
      WHERE id = ${id};
    `);
    });
  }

  async list(options: PaginatedOptions): Promise<Paginated<Task.Entity>> {
    const span = createRepositorySpan(
      PostgresTaskRepository.name,
      this.list.name,
    );

    return span(async () => {
      const pool = await ConnectionContext.use().get();
      const offset = (options.pageNumber - 1) * options.pageSize;
      const limit = options.pageSize + 1;

      const entities = await pool.many(sql.type(Task.Entity)`
      SELECT * FROM ${sql.identifier([this.tableName])}
      OFFSET ${offset}
      LIMIT ${limit};
    `);

      const isOverflowing = entities.length === limit;

      return {
        data: isOverflowing ? entities.slice(0, options.pageSize) : entities,
        hasNextPage: isOverflowing,
        ...options,
      };
    });
  }
}

export const PostgresTaskRepositoryProvider = TaskRepositoryContext.with(
  new PostgresTaskRepository(),
);
