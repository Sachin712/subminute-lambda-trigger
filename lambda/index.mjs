import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const client = new SNSClient({region: 'us-east-2'});
let intervalId;

export async function handler (event) {
    console.log('Lambda function triggered by CloudWatch Events: ');

    try {    
        console.log('in try');
        intervalId = setInterval(()=>{
            publishToSNSForAllItems()
        }, 14000);

        // Set up promise to wait for interval to complete
        const intervalPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                clearInterval(intervalId);
                resolve();
            }, 57000); // Stop interval after 57 seconds to allow time for cleanup
        });

        // Wait for the interval to complete
        await intervalPromise;

        return {
            statusCode: 200,
            body: JSON.stringify('SNS messages published successfully'),
        };
    } catch (err) {
        console.log('Error:', JSON.stringify(err));
        return {
            statusCode: 500,
            body: JSON.stringify('Error publishing SNS messages'),
        };
    }
};

// Function to publish to SNS for all items
async function publishToSNSForAllItems() {
    console.log(new Date());
    let msg = {
        "key": "value"
    }

    const input = { // PublishInput
    TopicArn: `arn:aws:sns:us-east-2:746827937111:Broker-Topic`,
    Message: JSON.stringify(msg), // required
    };

    try {
        // Publish to SNS for each item    
        const snsCommand = new PublishCommand(input)
        const snsRes = await client.send(snsCommand);
        console.log("SNS RES: " + JSON.stringify(snsRes))
        
    } catch (err) {
        console.log('Error publishing SNS messages:' + JSON.stringify(err));
        throw err; // Re-throw the error to be caught by the caller
    }
}