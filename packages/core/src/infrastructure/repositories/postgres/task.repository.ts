import { sql } from "slonik";

import { Paginated, PaginatedOptions } from "#common/pagination.js";
import { Task } from "#domain/entities/task.entity.js";
import { ConnectionContext } from "#domain/repositories/connection.js";
import { TaskRepository } from "#domain/repositories/task.repository.js";

export class PostgresTaskRepository implements TaskRepository {
  private tableName = "tasks";

  async save(entity: Task.Entity): Promise<void> {
    const pool = await ConnectionContext.use().get();

    await pool.query(sql.unsafe`
      INSERT INTO ${sql.identifier([this.tableName])} (id, title, status, created_at, updated_at)
      VALUES (
        ${entity.id},
        ${entity.title},
        ${entity.status},
        ${entity.createdAt.toISOString()},
        ${entity.updatedAt.toISOString()}
      ON CONFLICT (id) 
      DO UPDATE SET 
        title = ${entity.title},
        status = ${entity.status},
        updated_at = ${entity.updatedAt.toISOString()};
      );
    `);
  }

  async delete(entity: Task.Entity): Promise<void> {
    const pool = await ConnectionContext.use().get();

    await pool.query(sql.unsafe`
      DELETE FROM ${sql.identifier([this.tableName])}
      WHERE id = ${entity.id};
    `);
  }

  async findOne(id: Task.Entity["id"]): Promise<Task.Entity> {
    const pool = await ConnectionContext.use().get();

    return pool.one(sql.type(Task.Entity)`
      SELECT * FROM ${sql.identifier([this.tableName])}
      WHERE id = ${id};
    `);
  }

  async list(options: PaginatedOptions): Promise<Paginated<Task.Entity>> {
    const pool = await ConnectionContext.use().get();
    const offset = (options.pageNumber - 1) * options.pageSize;
    const limit = options.pageNumber + 1;

    const entities = await pool.many(sql.type(Task.Entity)`
      SELECT * FROM ${sql.identifier([this.tableName])}
      OFFSET ${offset}
      LIMIT ${limit};
    `);

    return {
      data: entities,
      hasNextPage: entities.length === limit,
      ...options,
    };
  }
}
