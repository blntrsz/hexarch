import { PostgresConnectionProvider } from "#infrastructure/repositories/postgres/connection.js";
import { PostgresTaskRepositoryProvider } from "#infrastructure/repositories/postgres/task.repository.js";
import { PostgresTransactionContext } from "#infrastructure/repositories/postgres/transaction.js";
import { AwsBusProvider } from "#infrastructure/services/aws/bus.js";
import { AwsObservabilityProvider } from "#infrastructure/services/aws/observability.js";

import { EnvironmentContextProvider } from "./environment";
import { Provider } from "./provider";

export const AppSettingsProvider = Provider([
  EnvironmentContextProvider,
  PostgresTransactionContext,

  AwsBusProvider,
  AwsObservabilityProvider,

  PostgresConnectionProvider,
  PostgresTaskRepositoryProvider,
]);
