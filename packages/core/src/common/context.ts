import { AsyncLocalStorage } from "node:async_hooks";

export function createContext<T>() {
  const storage = new AsyncLocalStorage<T>();
  return {
    use() {
      const result = storage.getStore();
      if (!result) {
        throw new Error("No context available");
      }
      return result;
    },
    with(value: T, cleanup?: () => Promise<void> | void) {
      return async function <R>(function_: () => R) {
        const result = await storage.run<R>(value, function_);
        await cleanup?.();

        return result;
      };
    },
  };
}
