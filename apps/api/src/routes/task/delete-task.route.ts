import { tasksEndpoints } from "@hexarch/contracts";
import { DeleteTaskUseCase } from "@hexarch/core/task/use-cases/delete-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { createApiSpan } from "#util/create-api-span.js";

export const deleteTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.deleteTask,
  async (c) => {
    const span = createApiSpan(c);

    return span(async () => {
      const { id } = c.req.valid("param");

      await new DeleteTaskUseCase().execute({
        id,
      });

      return c.text("", 204);
    });
  },
);
