import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { CreateTaskUseCase } from "@hexarch/core/task/use-cases/create-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { createApiSpan } from "#util/create-api-span.js";

import { serializeTask } from "./serialize";

export const createTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.createTask,
  async (c) => {
    const span = createApiSpan(c);

    return span(async () => {
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
    });
  },
);
