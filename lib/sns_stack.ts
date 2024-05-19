import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SnsStackProps extends cdk.StackProps {
  workerLambdaFunction: lambda.Function;
}

export class SnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SnsStackProps) {
    super(scope, id, props);

    // Create the SNS topic
    const topic = new sns.Topic(this, "MyTopic", {
      topicName: "Broker-Topic",
      displayName: "My SNS Topic",
    });

    // Subscribe the Lambda function to the SNS topic
    topic.addSubscription(
      new subs.LambdaSubscription(props.workerLambdaFunction)
    );
  }
}
