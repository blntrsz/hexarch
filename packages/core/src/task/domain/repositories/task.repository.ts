import { createContext } from "#common/context.js";
import { Paginated, PaginatedOptions } from "#common/pagination.js";

import { Task } from "../entities/task.entity";

export interface TaskRepository {
  save(entity: Task.Entity): Promise<void>;
  delete(entity: Task.Entity): Promise<void>;

  findOne(id: Task.Entity["id"]): Promise<Task.Entity>;
  list(options: PaginatedOptions): Promise<Paginated<Task.Entity>>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
