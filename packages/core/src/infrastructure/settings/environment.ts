import {
  EnvironmentContext,
  environmentSchema,
} from "#domain/settings/environment.js";

export const EnvironmentContextProvider = EnvironmentContext.with(
  environmentSchema.parse(process.env),
);
