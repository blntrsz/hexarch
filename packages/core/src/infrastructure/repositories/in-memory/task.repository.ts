import { Paginated } from "#common/pagination.js";
import { Task } from "#domain/entities/task.entity.js";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#domain/repositories/task.repository.js";

class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task.Info[];

  constructor() {
    this.tasks = [];
  }

  async save(entity: Task.Entity): Promise<void> {
    const existingTask = this.tasks.find((task) => task.id === entity.id);

    if (existingTask) {
      existingTask.status = entity.status;
      existingTask.title = entity.title;
      existingTask.updatedAt = entity.updatedAt;
      return;
    }

    this.tasks.push(entity);
  }

  async delete(entity: Task.Entity): Promise<void> {
    const index = this.tasks.findIndex((object) => object.id === entity.id);

    if (index !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.tasks.splice(index, 1)[0];
    }
  }

  async findOne(id: Task.Info["id"]): Promise<Task.Entity> {
    const entity = this.tasks.find((task) => task.id === id);

    if (!entity) throw new Error("Not Found");

    return Task.Entity.parse(entity);
  }

  async list(): Promise<Paginated<Task.Entity>> {
    return {
      data: this.tasks.slice(0, 10).map((d) => Task.Entity.parse(d)),
      pageSize: 10,
      pageNumber: 1,
      hasNextPage: true,
    };
  }
}

export const InMemoryTaskRepositoryProvider = TaskRepositoryContext.with(
  new InMemoryTaskRepository(),
);
