import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {


    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    try {
        // insert into dynamodb
        const resQuery = await dbClient.scan({
            TableName: TABLE_NAME!,
        }).promise();
        result.body = JSON.stringify(resQuery);

    } catch (error: any) {
        result.body = error.message;
        result.statusCode = 500
    }
    return result;
};

export { handler }