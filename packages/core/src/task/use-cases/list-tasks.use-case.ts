import { z } from "zod";

import { Guard } from "#common/guard.js";
import { createUseCaseSpan } from "#common/infrastructure/services/aws/observability.js";
import { PaginatedOptions } from "#common/pagination.js";
import { TaskRepositoryContext } from "#task/domain/repositories/task.repository.js";

type Input = z.infer<typeof Input>;
const Input = PaginatedOptions;

export class ListTasksUseCase {
  constructor(private readonly taskRepository = TaskRepositoryContext.use) {}

  async execute(input: Input) {
    const span = createUseCaseSpan(ListTasksUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);
      return this.taskRepository().list(input);
    });
  }
}
