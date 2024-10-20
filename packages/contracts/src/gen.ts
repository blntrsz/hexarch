import SwaggerParser from "@apidevtools/swagger-parser";
import {
  generateZodClientFromOpenAPI,
  getHandlebars,
} from "openapi-zod-client";
import type { oas30 } from "openapi3-ts";
import { resolveConfig } from "prettier";

const main = async () => {
  const Handlebars = getHandlebars();

  Handlebars.registerHelper("eq", function (a: unknown, b: unknown) {
    return a === b;
  });

  Handlebars.registerHelper("log", function (key: unknown) {
    console.log(JSON.stringify(key, undefined, 2));
  });

  Handlebars.registerHelper("getTag", function (path: string) {
    const regex = /\/\[a-z_\]+/;
    const match = path.match(regex);

    return match?.at(0)?.replace("/", "") ?? "default";
  });

  Handlebars.registerHelper("isNotVoidSchema", function (schema: string) {
    return schema !== "z.void()";
  });

  const openApiDocument = (await SwaggerParser.parse(
    "src/openapi.yaml",
  )) as oas30.OpenAPIObject;
  const prettierConfig = await resolveConfig(".");
  await generateZodClientFromOpenAPI({
    handlebars: Handlebars,
    prettierConfig,
    openApiDoc: openApiDocument,
    distPath: "src/gen/index.ts",
    templatePath: "src/template.hbs",
    options: {
      shouldExportAllSchemas: true,
      groupStrategy: "tag",
      withAlias: true,
      withDescription: true,
      withDocs: true,
      withAllResponses: true,
      withDefaultValues: true,
    },
  }).catch(console.error);

  console.log("Generated Zod client from OpenAPI spec");
};

main();
