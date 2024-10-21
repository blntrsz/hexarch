import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";

import { Exception, InternalServerException } from "#common/exception.js";
import {
  Observability,
  ObservabilityContext,
} from "#domain/services/observability.js";

export const SERVICE_NAME = "hexarch";

const logger = new Logger({ serviceName: SERVICE_NAME });
const tracer = new Tracer({ serviceName: SERVICE_NAME });
const metrics = new Metrics({
  serviceName: SERVICE_NAME,
  namespace: SERVICE_NAME,
});

function createMetricName(
  name: string,
  value: string,
  type: "success" | "fail" | "duration" | "count",
) {
  return `${name}::${value}::${type}`;
}

function spanHandler(name: string, value: string) {
  return async function <TCallback>(callback: () => Promise<TCallback>) {
    const start = Date.now();

    const parentSegment = tracer.getSegment();
    const subSegment = parentSegment?.addNewSubsegment(value);
    if (subSegment) {
      tracer.setSegment(subSegment);
    }

    logger.appendKeys({
      [name]: value,
    });

    try {
      const result = await callback();

      tracer.putAnnotation(createMetricName(name, value, "success"), 1);
      metrics.addMetric(
        createMetricName(name, value, "success"),
        MetricUnit.Count,
        1,
      );

      tracer.putAnnotation(createMetricName(name, value, "duration"), 1);
      metrics.addMetric(
        createMetricName(name, value, "duration"),
        MetricUnit.Milliseconds,
        Date.now() - start,
      );

      return result;
    } catch (error) {
      if (error instanceof Exception) {
        throw Exception;
      }

      tracer.putAnnotation(createMetricName(name, value, "fail"), 1);
      metrics.addMetric(
        createMetricName(name, value, "fail"),
        MetricUnit.Count,
        1,
      );

      tracer.addErrorAsMetadata(error as Error);
      logger.error((error as Error).message, error as Error);

      throw new InternalServerException();
    } finally {
      tracer.putAnnotation(createMetricName(name, value, "count"), 1);
      metrics.addMetric(
        createMetricName(name, value, "count"),
        MetricUnit.Count,
        1,
      );

      metrics.publishStoredMetrics();
      subSegment?.close();

      if (parentSegment) {
        tracer.setSegment(parentSegment);
      }
    }
  };
}

class AwsObservability implements Observability {
  span = spanHandler;

  info(message: string) {
    logger.info(message);
  }

  warn(message: string) {
    logger.warn(message);
  }

  error(message: string | Error) {
    if (message instanceof Error) {
      logger.error(message.message, message);
    } else {
      logger.info(message);
    }
  }

  debug(message: string) {
    logger.debug(message);
  }
}

export const AwsObservabilityProvider = ObservabilityContext.with(
  new AwsObservability(),
);
