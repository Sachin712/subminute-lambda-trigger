import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { globals } from "./globals";

export class IamRoleStack extends cdk.Stack {
  public readonly lambdaRole: iam.IRole;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.lambdaRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    const snsPublishPolicy = new iam.Policy(this, "SnsPublishPolicy", {
      statements: [
        new iam.PolicyStatement({
          actions: ["sns:Publish"],
          resources: [globals.snsTopicArn],
        }),
      ],
    });

    this.lambdaRole.attachInlinePolicy(snsPublishPolicy);

    this.lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );
  }
}
