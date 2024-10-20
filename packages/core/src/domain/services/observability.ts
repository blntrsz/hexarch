import { createContext } from "#common/context.js";

export interface Observability {
  span(
    key: string,
    value: string,
  ): <TReturnType>(
    callback: () => Promise<TReturnType>,
  ) => Promise<TReturnType>;
}

export const ObservabilityContext = createContext<Observability>();
