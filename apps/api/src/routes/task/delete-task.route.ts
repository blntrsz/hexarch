import { tasksEndpoints } from "@hexarch/contracts";
import { DeleteTaskUseCase } from "@hexarch/core/use-cases/task/delete-task.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";

export const deleteTaskRoute = new OpenAPIHono().openapi(
  tasksEndpoints.deleteTask,
  async (c) => {
    const { id } = c.req.valid("param");

    await new DeleteTaskUseCase().execute({
      id,
    });

    return c.text("", 204);
  },
);
