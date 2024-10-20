import { Stack } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new NodejsFunction(this, "api-handler", {
      entry: "./node_modules/@hexarch/api/src/index.ts",
      runtime: Runtime.NODEJS_20_X,
    });

    handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new LambdaRestApi(this, "api", {
      handler,
    });
  }
}
