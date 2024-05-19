import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { globals } from "./globals";

interface LambdaStackProps extends cdk.StackProps {
  lambdaRole: iam.IRole;
}

export class LambdaStack extends cdk.Stack {
  public readonly workerLambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const brokerLambdaFunction = new lambda.Function(this, "brokerLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda"), // Assuming your Lambda code is in the 'lambda' directory
      handler: "index.handler",
      role: props.lambdaRole,
      reservedConcurrentExecutions: 1
    });

    // Create a CloudWatch Events rule to trigger the Lambda every minute
    new events.Rule(this, "Rule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [new targets.LambdaFunction(brokerLambdaFunction)],
    });

    this.workerLambdaFunction = new lambda.Function(this, "workerLambdaFunction", {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("lambda"), // Assuming your Lambda code is in the 'lambda' directory
        handler: "workerLambda.handler",
        role: props.lambdaRole,
        reservedConcurrentExecutions: 1
    });

    this.workerLambdaFunction.addPermission('SnsInvokePermission', {
        principal: new iam.ServicePrincipal('sns.amazonaws.com'),
        sourceArn: globals.snsTopicArn,
        action: 'lambda:InvokeFunction',
      });
  }
}
