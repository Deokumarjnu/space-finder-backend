import { MissingFieldError, validateAsSpaceEntry } from './../shared/inputValidator';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { generateRandomId, getEventBody } from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {


    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    try {
        // take the body from event
        const item = getEventBody(event)
        item.spaceId = generateRandomId();
        validateAsSpaceEntry(item);
        // insert into dynamodb
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();
        result.body = JSON.stringify(`Create item with id ${item.spaceId}`);

    } catch (error: any) {
        if (error instanceof MissingFieldError) {
            result.statusCode = 403
        } else {
            result.statusCode = 500
        }
        result.body = error.message;

    }
    return result;
};

export { handler }