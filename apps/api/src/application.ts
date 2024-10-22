import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

import { createTaskRoute } from "#routes/task/create-task.route.js";
import { deleteTaskRoute } from "#routes/task/delete-task.route.js";
import { getTaskRoute } from "#routes/task/get-task.route.js";
import { listTasksRoute } from "#routes/task/list-tasks.route.js";
import { updateTaskRoute } from "#routes/task/update-task.route.js";

export const app = new OpenAPIHono();

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
    request: {
      curlOptions: [" -H 'Content-Type: application/json'"],
    },
  }),
);
app.doc("/doc", {
  openapi: "3.0.2",
  info: {
    version: "1.0.0",
    title: "Hexarch API",
  },
});

export const routes = app
  .route("/", createTaskRoute)
  .route("/", getTaskRoute)
  .route("/", listTasksRoute)
  .route("/", updateTaskRoute)
  .route("/", deleteTaskRoute);

export type Routes = typeof routes;
