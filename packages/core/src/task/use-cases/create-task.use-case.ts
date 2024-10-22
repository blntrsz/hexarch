import { z } from "zod";

import { BusContext } from "#common/domain/services/bus.js";
import { Guard } from "#common/guard.js";
import { TransactionContext } from "#common/infrastructure/repositories/transaction.js";
import { createUseCaseSpan } from "#common/infrastructure/services/aws/observability.js";
import { Task } from "#task/domain/entities/task.entity.js";
import { TaskEvent } from "#task/domain/events/task.events.js";
import { TaskRepositoryContext } from "#task/domain/repositories/task.repository.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  title: true,
});

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly bus = BusContext.use,
    private readonly transaction = TransactionContext.use,
  ) {}

  async execute(input: Input) {
    const span = createUseCaseSpan(CreateTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      const task = Task.create(input);

      return this.transaction().create(async () => {
        await this.taskRepository().save(task);
        await this.bus().emit(TaskEvent.getCreated(task));

        return task;
      });
    });
  }
}
