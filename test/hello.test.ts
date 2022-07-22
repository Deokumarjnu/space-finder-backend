// import { handler } from '../services/node-lambda/hello';
// import { handler } from "../services/SpaceTable/create";
import { handler } from "../services/SpaceTable/read";

// const event = {
//     body: {
//         location: "Sasaram"
//     }
// }
// handler(event as any, {} as any)

handler({} as any, {} as any).then((apiResult) => {
    const result = JSON.parse(apiResult.body);
    console.log(result)
})