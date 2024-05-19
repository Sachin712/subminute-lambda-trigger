#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IamRoleStack } from '../lib/iam_stack';
import { LambdaStack } from '../lib/function_stack';
import { SnsStack } from '../lib/sns_stack';

const app = new cdk.App();

// Create IAM Role Stack
const iamRoleStack = new IamRoleStack(app, 'IamRoleStack');

// Create Lambda Stack and pass the IAM role created in the IAM Role Stack
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  lambdaRole: iamRoleStack.lambdaRole
});

// sns Stack
const snsStack = new SnsStack(app, 'SnsStack',{
  workerLambdaFunction: lambdaStack.workerLambdaFunction
});


