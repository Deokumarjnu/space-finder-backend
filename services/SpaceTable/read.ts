import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from "aws-lambda";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {


    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Hello from Dynamodb !"
    }

    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters)
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters)
            }

        } else {
            // insert into dynamodb
            result.body = await scanTable()
        }
    } catch (error: any) {
        result.body = error.message;
        result.statusCode = 500
    }
    return result;
};

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];

    const queryResult = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey!,
        },
        ExpressionAttributeValues: {
            ':zzzz': queryValue
        }
    }).promise();

    return JSON.stringify(queryResult.Items);
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams[PRIMARY_KEY!]
    const queryResult = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
            ':zzzz': keyValue
        }
    }).promise();

    return JSON.stringify(queryResult.Items);
}
async function scanTable() {
    const resQuery = await dbClient.scan({
        TableName: TABLE_NAME!,
    }).promise();
    return JSON.stringify(resQuery.Items);
}

export { handler }