import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const client = new SNSClient({region: 'us-east-2'});

export async function handler (event) {
    console.log('Lambda function triggered by CloudWatch Events');

    let msg = {
        "key": "value"
    }

    const input = { // PublishInput
    TopicArn: `arn:aws:sns:us-east-2:746827937111:Broker-Topic`,
    Message: JSON.stringify(msg), // required
    };

    const command = new PublishCommand(input);
    const response = await client.send(command);

    console.log('res after sns call: ' + JSON.stringify(response));
    return 'Success';
};
