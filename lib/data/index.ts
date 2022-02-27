import { SetWithInlinePolicy, SetWithManagedPolicy } from '../types';

/**
 * Import all of the policy files here, then add the configuration below
 */
import { policy as examplePolicy1 } from './policies/example1';
import { policy as examplePolicy2 } from './policies/example2';

/**
 * Configuration for each Permission Set.
 */
export const permisssionSets: (SetWithInlinePolicy | SetWithManagedPolicy)[] = [
    {
        name: 'Example_Permission_Set1',
        description: 'For testing Permission set updates',
        sessionDuration: 2,
        accounts: [
            'prod',
            'master',
        ],
        groups: [
            'Developers',
            'ReadOnly',
        ],
        // List of AWS Managed Policy Arns
        managedPolicies: [
            'arn:aws:iam::aws:policy/job-function/ViewOnlyAccess',
        ],
        // Custom Inline Policy JSON
        inlinePolicy: examplePolicy1,
    },
    {
        name: 'Example_Permission_Set2',
        description: 'For testing Permission set updates',
        sessionDuration: 4,
        accounts: [
            'dev',
        ],
        groups: [
            'Developers',
        ],
        // List of AWS Managed Policy Arns
        managedPolicies: [],
        // Custom Inline Policy JSON
        inlinePolicy: examplePolicy2,
    },
];

export { environment, accountList, groupList } from './environment';
