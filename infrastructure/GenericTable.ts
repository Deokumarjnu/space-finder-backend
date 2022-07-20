import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

export class GenericTable {
    private stack: Stack;
    private table: Table;
    private name: string;
    private primaryKey: string;
    constructor(stack: Stack, name: string, primaryKey: string) {
        this.stack = stack;
        this.name = name;
        this.primaryKey = primaryKey;

        this.initialize();
    }

    private initialize() {
        this.createTable();
    }
    private createTable() {
        this.table = new Table(this.stack, this.name, {
            partitionKey: {
                name: this.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this.name
        })
    }
}