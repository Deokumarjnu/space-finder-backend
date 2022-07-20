import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';

export class SpaceStack extends Stack {
    constructor(Scope: Construct, id: string, props: StackProps) {
        super(Scope, id, props)
    }
}