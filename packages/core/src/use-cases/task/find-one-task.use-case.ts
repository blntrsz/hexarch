import { z } from "zod";

import { Guard } from "#common/guard.js";
import { Task } from "#domain/entities/task.entity.js";
import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { ObservabilityContext } from "#domain/services/observability.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  id: true,
});

export class FindOneTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
  ) {}

  async execute(input: Input) {
    const span = this.observability().span("use-case", FindOneTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      const task = Task.create({
        title: "task",
      });

      await this.taskRepository().upsert(task);

      return this.taskRepository().findOne(task.id);
    });
  }
}
