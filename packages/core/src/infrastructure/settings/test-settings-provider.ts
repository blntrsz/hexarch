import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { stringifyDsn } from "slonik";

import { PostgresConnectionProvider } from "#infrastructure/repositories/postgres/connection.js";
import { PostgresTaskRepositoryProvider } from "#infrastructure/repositories/postgres/task.repository.js";
import { PostgresTransactionContext } from "#infrastructure/repositories/postgres/transaction.js";
import { AwsObservabilityProvider } from "#infrastructure/services/aws/observability.js";
import { TestBusProvider } from "#infrastructure/services/test/bus.js";
import { EnvironmentContext } from "#domain/settings/environment.js";

import { Provider } from "./provider";

export function setupTestSettingsProvider(
  container: StartedPostgreSqlContainer,
) {
  return Provider([
    EnvironmentContext.with({
      NODE_ENV: "test",
      DATABASE_URL: stringifyDsn({
        host: container.getHost(),
        port: container.getPort(),
        databaseName: container.getDatabase(),
        username: container.getUsername(),
        password: container.getPassword(),
      }),
    }),
    PostgresTransactionContext,

    TestBusProvider,
    AwsObservabilityProvider,

    PostgresConnectionProvider,
    PostgresTaskRepositoryProvider,
  ]);
}
