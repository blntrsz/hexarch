export function Provider(contexts: ((callback: () => unknown) => unknown)[]) {
  return function <TResult>(
    callback: () => Promise<TResult> | TResult | void,
  ): Promise<TResult> {
    if (contexts.length > 1) {
      const [firstContext, ...otherContexts] = contexts;

      return firstContext(() =>
        Provider(otherContexts)(callback),
      ) as Promise<TResult>;
    }

    const [firstDependency] = contexts;
    return firstDependency(() => callback()) as Promise<TResult>;
  };
}
