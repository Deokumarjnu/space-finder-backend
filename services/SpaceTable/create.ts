import { v4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    // take the body from event
    const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    item.spaceId = v4();

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    try {
        // insert into dynamodb
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise()
    } catch (error: any) {
        result.body = error.message;
        result.statusCode = 500
    }
    result.body = JSON.stringify(`Create item with id ${item.spaceId}`);
    return result;
};

export { handler }