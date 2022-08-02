
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
// import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda"
import { join } from 'path';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { AuthorizerWrapper } from './auth/authorizer-wrapper';
import { GenericTable } from './GenericTable';

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');
    private authorizer: AuthorizerWrapper;

    private spacesTable = new GenericTable(this, {
        tableName: 'SpaceTable',
        primaryKey: 'spaceId',
        createLambdaPath: 'create',
        readLambdaPath: 'read',
        updateLambdaPath: 'update',
        deleteLambdaPath: 'delete',
        secondaryIndexs: ["location"]
    })

    constructor(Scope: Construct, id: string, props: StackProps) {
        super(Scope, id, props);

        this.authorizer = new AuthorizerWrapper(this, this.api);

        const optionWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        };

        const helloNodejsLambda = new NodejsFunction(this, 'NodejsLambda', {
            entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
            handler: 'handler'
        })

        // Integrate helloLambda with RestApi
        const helloLambdaIntegration = new LambdaIntegration(helloNodejsLambda);
        const helloLambdaResourse = this.api.root.addResource('hello');
        helloLambdaResourse.addMethod('GET', helloLambdaIntegration, optionWithAuthorizer);

        //Spaces API integrations:
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
        spaceResource.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);
    }
};
