import { z } from "zod";

import { Guard } from "#common/guard.js";
import { PaginatedOptions } from "#common/pagination.js";
import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { ObservabilityContext } from "#domain/services/observability.js";

type Input = z.infer<typeof Input>;
const Input = PaginatedOptions;

export class ListTasksUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
  ) {}

  async execute(input: Input) {
    const span = this.observability().span("use-case", ListTasksUseCase.name);

    return span(async () => {
      Guard.parseSchema(Input, input);
      return this.taskRepository().list(input);
    });
  }
}
