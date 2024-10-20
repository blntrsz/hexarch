import {
  Observability,
  ObservabilityContext,
} from "#domain/services/observability.js";

class AwsObservability implements Observability {
  span(name: string, value: string) {
    return async function <TCallback>(callback: () => Promise<TCallback>) {
      console.log(`Starting ${name}: ${value}`);
      console.log(`[${name}:${value}] Starting...`);
      const result = await callback();
      console.log(`[${name}:${value}] Success.`);

      return result;
    };
  }

  trackMetrics() {}

  info(message: string) {
    console.log(message);
  }

  warn(message: string) {
    console.warn(message);
  }

  error(message: string) {
    console.error(message);
  }

  debug(message: string) {
    console.debug(message);
  }

  close() {}
}

export const AwsObservabilityProvider = ObservabilityContext.with(
  new AwsObservability(),
);
