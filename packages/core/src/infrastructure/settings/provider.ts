// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function Provider(contexts: Function[]) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function (callback: Function) {
    if (contexts.length > 1) {
      const [firstContext, ...otherContexts] = contexts;

      return firstContext(() => Provider(otherContexts)(callback));
    }

    const [firstDependency] = contexts;
    return firstDependency(() => callback());
  };
}
