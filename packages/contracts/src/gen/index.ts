import { createRoute, z } from "@hono/zod-openapi";

const type = z.literal("tasks");
const title = z.string();
const TaskCreate = z.object({
  type: type,
  attributes: z.object({ title: title }),
});
const TaskIdentifier = z.object({ id: z.string(), type: z.literal("tasks") });
const TaskAttributes = z.object({
  title: z.string(),
  status: z.enum(["to_do", "in_progress", "done"]),
  created_at: z.string(),
  updated_at: z.string(),
});
const Task = TaskIdentifier.and(z.object({ attributes: TaskAttributes }));
const Links = z.object({ prev: z.string(), next: z.string() }).partial();
const status = z.enum(["to_do", "in_progress", "done"]);
const TaskUpdate = TaskIdentifier.and(
  z.object({
    attributes: z.object({ title: title, status: status }).partial(),
  }),
);

export const schemas = {
  type,
  title,
  TaskCreate,
  TaskIdentifier,
  TaskAttributes,
  Task,
  Links,
  status,
  TaskUpdate,
};

export const tasksEndpoints = {
  createTask: createRoute({
    path: "/tasks",
    method: "post",
    description: "",
    tags: ["tasks"],
    request: {
      query: z.object({}),
      params: z.object({}),
      body: {
        content: {
          "application/json": {
            schema: TaskCreate,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Task Created or Updated Response.",
        content: {
          "application/json": {
            schema: z.object({ data: Task }),
          },
        },
      },
    },
  }),
  getTasks: createRoute({
    path: "/tasks",
    method: "get",
    description: "",
    tags: ["tasks"],
    request: {
      query: z.object({
        "page[size]": z.coerce.number().int().optional().default(20),
        "page[number]": z.coerce.number().int().optional().default(1),
      }),
      params: z.object({}),
    },
    responses: {
      200: {
        description: "List Tasks.",
        content: {
          "application/json": {
            schema: z.object({ data: z.array(Task), links: Links.optional() }),
          },
        },
      },
    },
  }),
  getTask: createRoute({
    path: "/tasks/{id}",
    method: "get",
    description: "",
    tags: ["tasks"],
    request: {
      query: z.object({}),
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Get One Task Response.",
        content: {
          "application/json": {
            schema: z.object({ data: Task }),
          },
        },
      },
    },
  }),
  updateTask: createRoute({
    path: "/tasks/{id}",
    method: "patch",
    description: "",
    tags: ["tasks"],
    request: {
      query: z.object({}),
      params: z.object({
        id: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: TaskUpdate,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Get One Task Response.",
        content: {
          "application/json": {
            schema: z.object({ data: Task }),
          },
        },
      },
    },
  }),
  deleteTask: createRoute({
    path: "/tasks/{id}",
    method: "delete",
    description: "",
    tags: ["tasks"],
    request: {
      query: z.object({}),
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      204: {
        description: "No content",
      },
    },
  }),
};
