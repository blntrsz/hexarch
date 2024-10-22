import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { FindOneTaskUseCase } from "@hexarch/core/task/use-cases/find-one-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { createApiSpan } from "#util/create-api-span.js";

import { serializeTask } from "./serialize";

export const getTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.getTask,
  async (c) => {
    const span = createApiSpan(c);

    return span(async () => {
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
    });
  },
);
