import { InMemoryTaskRepositoryProvider } from "#infrastructure/repositories/in-memory/task.repository.js";
import { AwsBusProvider } from "#infrastructure/services/aws/bus.js";
import { AwsObservabilityProvider } from "#infrastructure/services/aws/observability.js";

import { Provider } from "./provider";

export const AppSettingsProvider = Provider([
  AwsBusProvider,
  AwsObservabilityProvider,

  InMemoryTaskRepositoryProvider,
]);
