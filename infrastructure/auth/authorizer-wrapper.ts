import { CfnOutput } from 'aws-cdk-lib';
import { CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthorizerWrapper {
    private scope: Construct;
    private api: RestApi;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;

    public authorizer: CognitoUserPoolsAuthorizer


    constructor(scope: Construct, api: RestApi) {
        this.scope = scope;
        this.api = api
        this.initialize();
        this.addUserPoolClient();
        this.createAuthorizer();
        this.createAdminGroup();
    }

    private initialize() {
        this.userPool = new UserPool(this.scope, 'SpaceUserPool', {
            userPoolName: 'SpaceUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });

        new CfnOutput(this.scope, 'UserPoolId', {
            value: this.userPool.userPoolId //need userpool id while authentication
        });
    }

    private addUserPoolClient() {
        this.userPoolClient = this.userPool.addClient("SpaceUserPool-Client", {
            userPoolClientName: "SpaceUserPool-Client",
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false
        });
        new CfnOutput(this.scope, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId //need userpool id while authentication
        });
    }
    private createAuthorizer() {
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, 'UserPoolAuthorizer', {
            authorizerName: 'UserPoolAuthorizer',
            cognitoUserPools: [this.userPool],
            identitySource: 'method.request.header.Authorization'
        }),
            this.authorizer._attachToApi(this.api);
    }

    private createAdminGroup() {
        new CfnUserPoolGroup(this.scope, 'admins', {
            groupName: 'admins',
            userPoolId: this.userPool.userPoolId
        })
    }
}