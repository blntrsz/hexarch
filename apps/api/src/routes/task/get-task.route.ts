import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { FindOneTaskUseCase } from "@hexarch/core/use-cases/task/find-one-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { serializeTask } from "./serialize";

export const getTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.getTask,
  async (c) => {
    const { id } = c.req.valid("param");

    const result = await new FindOneTaskUseCase().execute({
      id,
    });

    return c.json(
      {
        data: serializeTask(result, schemas.Task),
      },
      200,
    );
  },
);
