import { ConnectionContext } from "#domain/repositories/connection.js";

import { PostgresConnection } from "./connection";

export async function createTransaction<TResult>(
  callback: () => Promise<TResult>,
) {
  const conn = await ConnectionContext.use().get();

  return conn.transaction((tx) => {
    return ConnectionContext.with(new PostgresConnection(tx))(callback);
  });
}
