import { AppSettingsProvider } from "@hexarch/core/common/infrastructure/settings/app-settings-provider";
import { serve } from "@hono/node-server";

import { app } from "./application";

AppSettingsProvider(() => {
  serve(app, (addr) => {
    console.log(`Running on http://localhost:${addr.port}`);
  });
});
