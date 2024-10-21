import { createContext } from "#common/context.js";

export interface Observability {
  span(
    key: string,
    value: string,
  ): <TReturnType>(
    callback: () => Promise<TReturnType>,
  ) => Promise<TReturnType>;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string | Error): void;
}

export const ObservabilityContext = createContext<Observability>();
