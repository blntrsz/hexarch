import { z } from "zod";

import { Guard } from "#common/guard.js";
import { Task } from "#domain/entities/task.entity.js";
import { TaskEvent } from "#domain/events/task.events.js";
import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { BusContext } from "#domain/services/bus.js";
import { ObservabilityContext } from "#domain/services/observability.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  id: true,
  title: true,
  status: true,
});

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
    private readonly bus = BusContext.use,
  ) {}

  async execute(input: Input) {
    const span = this.observability().span("use-case", UpdateTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      const existingTask = await this.taskRepository().findOne(input.id);

      const task = Task.update(existingTask, {
        title: input.title,
        status: input.status,
      });

      await this.taskRepository().save(task);
      await this.bus().emit(TaskEvent.getUpdated(existingTask, task));

      return task;
    });
  }
}
