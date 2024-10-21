import { OpenAPIHono } from "@hono/zod-openapi";

import { createTaskRoute } from "#routes/task/create-task.route.js";
import { deleteTaskRoute } from "#routes/task/delete-task.route.js";
import { getTaskRoute } from "#routes/task/get-task.route.js";
import { listTasksRoute } from "#routes/task/list-tasks.route.js";
import { updateTaskRoute } from "#routes/task/update-task.route.js";

export const app = new OpenAPIHono();

export const routes = app
  .route("/", createTaskRoute)
  .route("/", getTaskRoute)
  .route("/", listTasksRoute)
  .route("/", updateTaskRoute)
  .route("/", deleteTaskRoute);

export type Routes = typeof routes;
