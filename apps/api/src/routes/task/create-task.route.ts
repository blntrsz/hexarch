import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { CreateTaskUseCase } from "@hexarch/core/use-cases/task/create-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { serializeTask } from "./serialize";

export const createTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.createTask,
  async (c) => {
    const body = c.req.valid("json");

    const result = await new CreateTaskUseCase().execute({
      title: body.attributes.title,
    });

    return c.json(
      {
        data: serializeTask(result, schemas.Task),
      },
      201,
    );
  },
);
