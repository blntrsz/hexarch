import { z } from "zod";

import { Guard } from "#common/guard.js";
import { Task } from "#domain/entities/task.entity.js";
import { TaskEvent } from "#domain/events/task.events.js";
import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { BusContext } from "#domain/services/bus.js";
import { ObservabilityContext } from "#domain/services/observability.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  title: true,
});

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
    private readonly bus = BusContext.use,
  ) {}

  async execute(input: Input) {
    const span = this.observability().span("use-case", CreateTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      const task = Task.create(input);
      await this.taskRepository().save(task);
      await this.bus().emit(TaskEvent.getCreated(task));

      return task;
    });
  }
}
