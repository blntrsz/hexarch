import { InMemoryTaskRepositoryProvider } from "#infrastructure/repositories/in-memory/task.repository.js";
import { AwsBusProvider } from "#infrastructure/services/aws/bus.js";
import { AwsObservabilityProvider } from "#infrastructure/services/aws/observability.js";

import { EnvironmentContextProvider } from "./environment";
import { Provider } from "./provider";

export const AppSettingsProvider = Provider([
  EnvironmentContextProvider,

  AwsBusProvider,
  AwsObservabilityProvider,

  InMemoryTaskRepositoryProvider,
]);
