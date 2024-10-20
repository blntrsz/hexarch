import { TaskRepositoryContext } from "#domain/repositories/task.repository.js";
import { ObservabilityContext } from "#domain/services/observability.js";

export class ListTasksUseCase {
  constructor(
    private readonly taskRepository = TaskRepositoryContext.use,
    private readonly observability = ObservabilityContext.use,
  ) {}

  async execute() {
    const span = this.observability().span("use-case", ListTasksUseCase.name);

    return span(async () => {
      return this.taskRepository().list();
    });
  }
}
