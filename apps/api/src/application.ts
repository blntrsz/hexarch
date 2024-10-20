import { CreateTaskUseCase } from "@hexarch/core/use-cases/task/create-task.use-case";
import { FindOneTaskUseCase } from "@hexarch/core/use-cases/task/find-one-task.use-case";
import { Hono } from "hono";

export const app = new Hono()
  .post("/tasks", async (c) => {
    const result = await new CreateTaskUseCase().execute({
      title: "",
    });

    return c.json(result);
  })
  .get("/tasks/:id", async (c) => {
    const { id } = c.req.param();
    const result = await new FindOneTaskUseCase().execute({ id });

    return c.json(result);
  });
