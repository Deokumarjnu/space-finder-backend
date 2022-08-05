import { CfnOutput } from 'aws-cdk-lib';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export class IdentityPoolWrappwer {
    private scope: Construct;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    public adminRole: Role;

    constructor(scope: Construct, userPool: UserPool, userPoolClient: UserPoolClient) {
        this.scope = scope;
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;
        // Initialize IAM Role
        this.initialize();
    }
    private initialize() {
        this.initializeIdentityPool();
        this.initializeRole();
        this.attachRoles();
    }
    private initializeIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'SpaceFinderIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        }),
            new CfnOutput(this.scope, 'IdentityPool', {
                value: this.identityPool.ref
            });
    };

    private initializeRole() {
        this.authenticatedRole = new Role(this.scope, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": "us-east-1:47806f13-b981-44b4-b941-5ef3a0e898ab"
                },
                "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            },
                "sts:AssumeRoleWithWebIdentity"
            ),
        });
        this.unAuthenticatedRole = new Role(this.scope, 'CognitoDefaultUnAuthenticatedRole', {
            assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": "us-east-1:47806f13-b981-44b4-b941-5ef3a0e898ab"
                },
                "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated"
                }
            },
                "sts:AssumeRoleWithWebIdentity"
            ),
        });

        this.adminRole = new Role(this.scope, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal("cognito-identity.amazonaws.com", {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": this.identityPool.ref
                },
                "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            },
                "sts:AssumeRoleWithWebIdentity"
            ),
        });

        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets'],
            resources: ['*']
        }));
    }

    private attachRoles() {
        new CfnIdentityPoolRoleAttachment(this.scope, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }

}