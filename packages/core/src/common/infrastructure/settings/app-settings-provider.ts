import { PostgresConnectionProvider } from "#task/infrastructure/repositories/postgres/connection.js";
import { PostgresTaskRepositoryProvider } from "#task/infrastructure/repositories/postgres/task.repository.js";
import { PostgresTransactionContext } from "#task/infrastructure/repositories/postgres/transaction.js";

import { AwsBusProvider } from "../services/aws/bus";
import { EnvironmentContextProvider } from "./environment";
import { Provider } from "./provider";

export const AppSettingsProvider = Provider([
  EnvironmentContextProvider,
  PostgresTransactionContext,

  AwsBusProvider,

  PostgresConnectionProvider,
  PostgresTaskRepositoryProvider,
]);
