import { z } from "zod";

import { createContext } from "#common/context.js";

export const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1, `DATABASE_URL is required.`),
  // eslint-disable-next-line unicorn/prefer-top-level-await
  NODE_ENV: z.enum(["test", "development", "production"]).catch("production"),
});

export const EnvironmentContext =
  createContext<z.infer<typeof environmentSchema>>();
