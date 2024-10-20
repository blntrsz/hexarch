import { z } from "zod";

import { Guard } from "#common/guard.js";
import { Task } from "#domain/entities/task.entity.js";
import { TaskEvent } from "#domain/events/task.events.js";
import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { TransactionContext } from "#domain/repositories/transaction.js";
import { BusContext } from "#domain/services/bus.js";
import { ObservabilityContext } from "#domain/services/observability.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  id: true,
});

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
    private readonly bus = BusContext.use,
    private readonly transaction = TransactionContext.use,
  ) {}

  async execute(input: Input) {
    const span = this.observability().span("use-case", DeleteTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      const task = await this.taskRepository().findOne(input.id);

      return this.transaction().create(async () => {
        await this.taskRepository().delete(task);
        await this.bus().emit(TaskEvent.getDeleted(task));

        return task;
      });
    });
  }
}
