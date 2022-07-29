import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME!;
const PRIMARY_KEY = process.env.PRIMARY_KEY!;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    // take the body from event
    try {
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

        if (spaceId) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key: {
                    [PRIMARY_KEY]: spaceId
                },
            }).promise();
            result.body = JSON.stringify(deleteResult);
        }
    } catch (error: any) {
        result.body = error.message;
    }
    return result;
};

export { handler }