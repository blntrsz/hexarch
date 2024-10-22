import { createContext } from "#common/context.js";

export type CreateTransaction = {
  create: <TResult>(callback: () => Promise<TResult>) => Promise<TResult>;
};

export const TransactionContext = createContext<CreateTransaction>();
