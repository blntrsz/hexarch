import { z } from "zod";

import { Guard } from "#common/guard.js";
import { createUseCaseSpan } from "#common/infrastructure/services/aws/observability.js";
import { Task } from "#task/domain/entities/task.entity.js";
import { TaskRepositoryContext } from "#task/domain/repositories/task.repository.js";

type Input = z.infer<typeof Input>;
const Input = Task.Info.pick({
  id: true,
});

export class FindOneTaskUseCase {
  constructor(private readonly taskRepository = TaskRepositoryContext.use) {}

  async execute(input: Input) {
    const span = createUseCaseSpan(FindOneTaskUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);

      return this.taskRepository().findOne(input.id);
    });
  }
}
