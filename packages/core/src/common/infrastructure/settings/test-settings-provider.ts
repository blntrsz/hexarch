import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { stringifyDsn } from "slonik";

import { EnvironmentContext } from "#common/domain/settings/environment.js";
import { TestBusProvider } from "#common/infrastructure/services/test/bus";
import { PostgresConnectionProvider } from "#task/infrastructure/repositories/postgres/connection.js";
import { PostgresTaskRepositoryProvider } from "#task/infrastructure/repositories/postgres/task.repository.js";
import { PostgresTransactionContext } from "#task/infrastructure/repositories/postgres/transaction.js";

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

    PostgresConnectionProvider,
    PostgresTaskRepositoryProvider,
  ]);
}
