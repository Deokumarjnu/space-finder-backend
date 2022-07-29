import { APIGatewayProxyEvent } from 'aws-lambda';
// import { handler } from '../services/node-lambda/hello';
import { handler } from "../services/SpaceTable/create";
// import { handler } from "../services/SpaceTable/read";

// import { handler } from "../services/SpaceTable/update";

// import { handler } from "../services/SpaceTable/delete";

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        "spaceId": "879ed535-d4fb-418c-8e7d-9cabf5ae5f63"
    },
    body: {
        location: "Updated from test"
    }
} as any

handler(event, {} as any).then((apiResult) => {
    const result = JSON.parse(apiResult.body);
    console.log(result)
})