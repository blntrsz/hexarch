import { createContext } from "../../common/context";
import { Paginated } from "../../common/pagination";
import { Task } from "../entities/task.entity";

export interface TaskRepository {
  upsert(entity: Task.Entity): Promise<void>;
  delete(entity: Task.Entity): Promise<void>;

  findOne(id: Task.Entity["id"]): Promise<Task.Entity>;
  list(): Promise<Paginated<Task.Entity>>;
}

export const TaskRepositoryContext = createContext<TaskRepository>();
