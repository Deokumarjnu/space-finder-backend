import { generateRandomId } from "../shared/utils";
import { S3 } from "aws-sdk";
const S3Client = new S3()
async function handler(event: any, context: any) {
    const bucketList = await S3Client.listBuckets().promise()
    console.log("Got an event - bucketList!");
    console.log(bucketList);
    return {
        statusCode: 200,
        body: {
            message: "Hello from node lambda!" + generateRandomId()
        }
    }
}

export { handler }