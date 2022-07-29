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
    const requestBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

    if (requestBody && spaceId) {
        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];
        const updateResult = await dbClient.update({
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: spaceId
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues: {
                ':new': requestBodyValue
            },
            ExpressionAttributeNames: {
                '#zzzNew': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        result.body = JSON.stringify(updateResult);
    }
    return result;
};

export { handler }