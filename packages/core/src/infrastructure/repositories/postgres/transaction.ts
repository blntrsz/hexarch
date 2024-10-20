import { TransactionContext } from "#domain/repositories/transaction.js";

import { ConnectionContext, PostgresConnection } from "./connection";

export const PostgresTransactionContext = TransactionContext.with({
  create: async function createTransaction<TResult>(
    callback: () => Promise<TResult>,
  ) {
    const conn = await ConnectionContext.use().get();

    return conn.transaction((tx) => {
      return ConnectionContext.with(new PostgresConnection(tx))(callback);
    });
  },
});
