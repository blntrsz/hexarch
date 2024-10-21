import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { UpdateTaskUseCase } from "@hexarch/core/use-cases/task/update-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

import { serializeTask } from "./serialize";

export const updateTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.updateTask,
  async (c) => {
    const body = c.req.valid("json");

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
  },
);
