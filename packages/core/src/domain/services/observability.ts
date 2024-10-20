import { createContext } from "../../common/context";

export interface Observability {
  span(
    key: string,
    value: string,
  ): <TReturnType>(
    callback: () => Promise<TReturnType>,
  ) => Promise<TReturnType>;
}

export const ObservabilityContext = createContext<Observability>();
