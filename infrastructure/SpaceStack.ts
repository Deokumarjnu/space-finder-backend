import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda"
import { join } from 'path';
export class SpaceStack extends Stack {
    constructor(Scope: Construct, id: string, props: StackProps) {
        super(Scope, id, props);

        const helloLambda = new LambdaFunction(this, 'hello-lambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        });
    }


}