import { createSpan } from "@hexarch/core/common/infrastructure/services/aws/observability";
import { AppSettingsProvider } from "@hexarch/core/common/infrastructure/settings/app-settings-provider";
import { handle, LambdaContext, LambdaEvent } from "hono/aws-lambda";

import { app } from "./application";

export function handler(event: LambdaEvent, lambdaContext?: LambdaContext) {
  return AppSettingsProvider(() => {
    const span = createSpan("Application", "Api");

    return span(() => {
      return handle(app)(event, lambdaContext);
    });
  });
}
