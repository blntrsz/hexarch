import {
  EnvironmentContext,
  environmentSchema,
} from "#common/domain/settings/environment.js";

export const EnvironmentContextProvider = EnvironmentContext.with(
  environmentSchema.parse(process.env),
);
