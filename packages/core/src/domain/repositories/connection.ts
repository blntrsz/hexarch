import { CommonQueryMethods } from "slonik";

import { createContext } from "#common/context.js";

export interface Connection {
  get(): Promise<CommonQueryMethods>;
}

export const ConnectionContext = createContext<Connection>();
