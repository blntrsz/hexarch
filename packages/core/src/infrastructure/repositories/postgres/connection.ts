import {
  CommonQueryMethods,
  createPool,
  DatabasePool,
  Interceptor,
} from "slonik";
// @ts-expect-error -- not typed
import { createInterceptors as createSlonikInterceptors } from "slonik-interceptor-preset";

import {
  Connection,
  ConnectionContext,
} from "#domain/repositories/connection.js";
import { EnvironmentContext } from "#domain/settings/environment.js";

type UserConfigurationType = {
  /**
   * Dictates whether to enable the [query benchmarking interceptor](https://github.com/gajus/slonik-interceptor-query-benchmarking).
   * @default false
   */
  benchmarkQueries?: boolean;
  /**
   * Dictates whether to enable the [query logging interceptor](https://github.com/gajus/slonik-interceptor-query-logging).
   * @default true
   */
  logQueries?: boolean;
  /**
   * Dictates whether to enable the [query normalisation interceptor](https://github.com/gajus/slonik-interceptor-query-normalisation).
   * @default true
   */
  normaliseQueries?: boolean;
  /**
   * Dictates whether to enable the [field name transformation interceptor](https://github.com/gajus/slonik-interceptor-field-name-transformation).
   * @default true
   */
  transformFieldNames?: boolean;
};

export function createInterceptors(
  userConfiguration?: UserConfigurationType,
): ReadonlyArray<Interceptor> {
  return createSlonikInterceptors(userConfiguration);
}

export class PostgresConnection implements Connection {
  pool?: CommonQueryMethods | DatabasePool;

  constructor(pool?: CommonQueryMethods) {
    this.pool = pool;
  }

  async get() {
    if (this.pool) return this.pool;

    const environment = EnvironmentContext.use();
    const pool = await createPool(environment.DATABASE_URL, {
      interceptors: createInterceptors({
        logQueries: environment.NODE_ENV !== "production",
      }),
    });
    this.pool = pool;

    return pool;
  }

  async cleanup() {
    if (this.pool && "end" in this.pool) {
      await this.pool.end();
    }
  }
}

const instance = new PostgresConnection();

export const PostgresConnectionProvider = ConnectionContext.with(
  instance,
  instance.cleanup,
);
