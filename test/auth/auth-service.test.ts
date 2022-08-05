import { AuthService } from './auth-service';
import { config } from './config';
import * as AWS from 'aws-sdk';

AWS.config.region = config.REGION;

async function getBucketList() {
    let bucket;
    try {
        bucket = await new AWS.S3().listBuckets().promise()
    } catch (error) {
        bucket = undefined;
    }
    return bucket;
}

const authService = new AuthService();

async function callStuff() {
    const authService = new AuthService();

    const user = await authService.login(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);
    await authService.getAWSTemporaryCreds(user);
    const someCreds = AWS.config.credentials;
    const bucketList = await getBucketList()
    const a = 5;
}

callStuff();