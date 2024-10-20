#!/usr/bin/env node

import "source-map-support/register";

import * as cdk from "aws-cdk-lib";

import { ApplicationStack } from "#stacks/application-stack";

const app = new cdk.App();
new ApplicationStack(app, "application-stack");

