import { GenericTable } from './GenericTable';
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda"
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';



export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');
    private spaceTable = new GenericTable(this, 'SpaceTable', 'spaceId');

    constructor(Scope: Construct, id: string, props: StackProps) {
        super(Scope, id, props);

        const helloLambda = new LambdaFunction(this, 'hello-lambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        });

        // integrate helloLambda with RestApi
        const helloLambdaIntegration = new LambdaIntegration(helloLambda);
        const helloLambdaResourse = this.api.root.addResource('hello');
        helloLambdaResourse.addMethod('GET', helloLambdaIntegration);

    }


}