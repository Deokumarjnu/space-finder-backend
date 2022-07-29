import { APIGatewayProxyEvent } from 'aws-lambda';
// import { handler } from '../services/node-lambda/hello';
// import { handler } from "../services/SpaceTable/create";
// import { handler } from "../services/SpaceTable/read";

// import { handler } from "../services/SpaceTable/update";

import { handler } from "../services/SpaceTable/delete";

// const event = {
//     body: {
//         location: "Sasaram"
//     }
// }
// handler(event as any, {} as any)

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        "spaceId": "1fd277ae-3778-4967-bb8a-a6059b2718ea"
    }
} as any

handler(event, {} as any).then((apiResult) => {
    const result = JSON.parse(apiResult.body);
    console.log(result)
})