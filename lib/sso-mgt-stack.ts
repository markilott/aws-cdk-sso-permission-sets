import * as moment from 'moment';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnPermissionSet, CfnAssignment } from 'aws-cdk-lib/aws-sso';

// Configuration files and polices from the data folder
import {
    environment, permisssionSets, groupList, accountList,
} from './data';

/**
 * Creates a CloudFormation stack containing the configured Permission Sets.
 * We are using L1 CloudFormation constructs as L2 CDK constructs are
 * not currently available.
 * The Permission Sets will be automatically provisioned to the relevant Accounts
 * by CloudFormation after deployment or update.
 */
export class SsoMgtStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const instanceArn = environment.ssoInstanceArn;

        // Create and Assign Permission set for each configuration
        permisssionSets.forEach((set) => {
            const {
                name, description, sessionDuration, accounts, groups, managedPolicies, inlinePolicy,
            } = set;

            // Create the Permission Set
            const permissionSet = new CfnPermissionSet(this, `${name}_Set`, {
                name,
                description,
                instanceArn,
                sessionDuration: moment.duration(sessionDuration, 'hours').toISOString(),
                inlinePolicy,
                managedPolicies,
            });
            new CfnOutput(this, `${name}Arn`, {
                description: `${name} Arn`,
                value: permissionSet.attrPermissionSetArn,
            });

            // Assign to Accounts and Groups
            accounts.forEach((acc) => {
                const accNum = accountList[acc];
                groups.forEach((group) => {
                    const groupId = groupList[group];
                    new CfnAssignment(this, `${name}_${accNum}_${group}_Assignment`, {
                        instanceArn,
                        permissionSetArn: permissionSet.attrPermissionSetArn,
                        principalId: groupId,
                        principalType: 'GROUP',
                        targetId: accNum,
                        targetType: 'AWS_ACCOUNT',
                    });
                });
            });
        });
    }
}
