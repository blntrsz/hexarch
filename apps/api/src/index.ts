import { ObservabilityContext } from "@hexarch/core/domain/services/observability";
import { AppSettingsProvider } from "@hexarch/core/infrastructure/settings/app-settings-provider";
import { handle, LambdaContext, LambdaEvent } from "hono/aws-lambda";

import { app } from "./application";

export function handler(event: LambdaEvent, lambdaContext?: LambdaContext) {
  return AppSettingsProvider(() => {
    const span = ObservabilityContext.use().span("application", "api");

    return span(() => {
      return handle(app)(event, lambdaContext);
    });
  });
}
