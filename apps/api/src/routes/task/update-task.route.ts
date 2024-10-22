import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { UpdateTaskUseCase } from "@hexarch/core/task/use-cases/update-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { createApiSpan } from "#util/create-api-span.js";

import { serializeTask } from "./serialize";

export const updateTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.updateTask,
  async (c) => {
    const span = createApiSpan(c);

    return span(async () => {
      const body = await c.req.json();

      const result = await new UpdateTaskUseCase().execute({
        id: body.id,
        status: body.attributes.status,
        title: body.attributes.title,
      });

      return c.json(
        {
          data: serializeTask(result, schemas.Task),
        },
        200,
      );
    });
  },
);
