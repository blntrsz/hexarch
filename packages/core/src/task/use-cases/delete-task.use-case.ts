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
  id: true,
});

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly bus = BusContext.use,
    private readonly transaction = TransactionContext.use,
  ) {}

  async execute(input: Input) {
    const span = createUseCaseSpan(DeleteTaskUseCase.name);

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
