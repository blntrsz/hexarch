import { createSpan } from "@hexarch/core/common/infrastructure/services/aws/observability";
import { Context } from "hono";

export function createApiSpan(c: Context) {
  return createSpan("ApiHandler", `${c.req.method}::${c.req.routePath}`);
}
