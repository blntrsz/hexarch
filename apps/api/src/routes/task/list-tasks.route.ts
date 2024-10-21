import { schemas, tasksEndpoints } from "@hexarch/contracts";
import { ListTasksUseCase } from "@hexarch/core/use-cases/task/list-tasks.use-case";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Context } from "hono";

import { serializeTask } from "./serialize";

function createLinks(
  c: Context,
  pageSize: number,
  pageNumber: number,
  hasNext: boolean,
) {
  const previousLink = new URLSearchParams({
    "page[number]": (pageNumber - 1).toString(),
    "page[size]": pageSize.toString(),
  });
  const nextLink = new URLSearchParams({
    "page[number]": (pageNumber + 1).toString(),
    "page[size]": pageSize.toString(),
  });

  return {
    prev:
      pageNumber === 1 ? undefined : `${c.req.path}?${previousLink.toString()}`,
    next: hasNext ? `${c.req.path}?${nextLink.toString()}` : undefined,
  };
}

export const listTasksRoute = new OpenAPIHono().openapi(
  tasksEndpoints.getTasks,
  async (c) => {
    const query = c.req.valid("query");

    const result = await new ListTasksUseCase().execute({
      pageSize: query["page[size]"],
      pageNumber: query["page[number]"],
    });

    return c.json(
      {
        data: result.data.map((d) => serializeTask(d, schemas.Task)),
        links: createLinks(
          c,
          result.pageSize,
          result.pageNumber,
          result.hasNextPage,
        ),
      },
      200,
    );
  },
);
