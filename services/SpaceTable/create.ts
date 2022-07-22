import { v4 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    // Insert Item
    const item = {
        spaceId: v4()
    }

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    try {
        await dbClient.put({
            TableName: 'SpaceTable',
            Item: item
        }).promise()
    } catch (error: any) {
        result.body = error.message;
        result.statusCode = 500
    }
    return result;
};

export { handler }