import { faker } from "@faker-js/faker";
import { migrate } from "@hexarch/migrator/src/test";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

import { testBus } from "#common/infrastructure/services/test/bus.js";
import { setupTestSettingsProvider } from "#common/infrastructure/settings/test-settings-provider.js";
import { TaskEvent } from "#task/domain/events/task.events.js";

import { CreateTaskUseCase } from "./create-task.use-case";
import { DeleteTaskUseCase } from "./delete-task.use-case";
import { FindOneTaskUseCase } from "./find-one-task.use-case";
import { ListTasksUseCase } from "./list-tasks.use-case";
import { UpdateTaskUseCase } from "./update-task.use-case";

describe("Task Use Cases", async () => {
  let container: StartedPostgreSqlContainer;
  beforeEach(async () => {
    const postgres = new PostgreSqlContainer();
    container = await postgres.start();
    await migrate(container);
  });

  afterAll(async () => {
    await container.stop();
  });

  test("Create, Update and Delete a task", async () => {
    await setupTestSettingsProvider(container)(async () => {
      const taskTitle = faker.word.words(10);

      const task = await new CreateTaskUseCase().execute({
        title: taskTitle,
      });

      expect(await new FindOneTaskUseCase().execute({ id: task.id })).toEqual({
        id: task.id,
        title: taskTitle,
        status: "to_do",
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });

      await new UpdateTaskUseCase().execute({
        id: task.id,
        status: "done",
      });

      const updatedTask = await new FindOneTaskUseCase().execute({
        id: task.id,
      });
      expect(updatedTask).toEqual({
        id: task.id,
        title: taskTitle,
        status: "done",
        createdAt: task.createdAt,
        updatedAt: expect.any(Date),
      });

      expect(task.updatedAt).not.toBe(updatedTask.updatedAt);

      await new DeleteTaskUseCase().execute({
        id: task.id,
      });

      expect(
        new FindOneTaskUseCase().execute({
          id: task.id,
        }),
      ).rejects.toThrow();

      expect(testBus.events).toEqual([
        expect.objectContaining({
          name: TaskEvent.created,
        }),
        expect.objectContaining({
          name: TaskEvent.updated,
        }),
        expect.objectContaining({
          name: TaskEvent.deleted,
        }),
      ]);
    });
  });

  test("Paginate Tasks", async () => {
    const postgres = new PostgreSqlContainer();
    const container = await postgres.start();
    await migrate(container);

    await setupTestSettingsProvider(container)(async () => {
      await Promise.all(
        Array.from({ length: 15 }).map(() => {
          return new CreateTaskUseCase().execute({
            title: faker.word.words(10),
          });
        }),
      );

      const firstPage = await new ListTasksUseCase().execute({
        pageSize: 10,
        pageNumber: 1,
      });

      expect(firstPage.data.length).toBe(10);
      expect(firstPage.hasNextPage).toBe(true);

      const secondPage = await new ListTasksUseCase().execute({
        pageSize: 10,
        pageNumber: 2,
      });

      expect(secondPage.data.length).toBe(5);
      expect(secondPage.hasNextPage).toBe(false);
    });
  });
});
