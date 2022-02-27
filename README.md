# Provision AWS SSO Permission Sets with CDK

This project demonstrates how to create and assign AWS SSO Permission Sets using CDK.

The project is built in Typescript and uses CDK v2.

These instructions assume you already have CDK v2 configured on your PC. The linting and autoformatting are designed for VSCode but should work in other editors.

AWS requirements:
- `Organisation` and at least one child `Account`.
- SSO configured. You can use any directory including the built in one to get started.
- At least one `Group` configured in SSO.

A more detailed explanation is available [in this Medium article](https://markilott.medium.com/provisioning-aws-sso-permissions-with-cdk-5ab492ef73d2).

---
## Setup and Deployment

Setup:
- `npm install`   will install all the required components
- Update the settings in `lib/data/environment.ts` with your own SSO and Account details
- Update the Permission Set settings in `lib/data/index.ts`. The Accounts and Groups must match those configured in `environment.ts`

Deployment:
- `cdk diff`        to compare deployed stack with current state
- `cdk synth`       emits the synthesized CloudFormation template
- `npm run deploy` or `cdk deploy`   will compile and deploy (using your current default AWS CLI permissions)

The Permission Sets will be provisioned to the relevant Accounts by CloudFormation on deployment. There is no need to manually provision in SSO.

---
## Setttings

Environment settings are contained in `lib/data/environment.ts`. You must update with your own environment before deploying.

Key settings:
- `account` and `region` are your Organisation Master account where SSO is configured.
- `ssoInstanceArn` is the insance id of your SSO configuration. Find it in the Settings section in SSO.
- `accountList` is a list of Accounts in your Organisation were you want to provision the Permission Sets.
- `groupList` is a list of Groups in your SSO directory that you want to assign Permissions Sets to.

It is also possible to assign Permission Sets to Users but I have not included the config here as it is not best practise.

---
## Policies

We can deploy Permission Sets using custom Inline Polices or attach AWS Managed Policies, or a combination of both.

Custom inline Policy files are contained in the `lib/data/policies` folder. There are two examples to get you started.


### Inline Policy Files

Creating/updating Inline Permission Sets:
- Copy or modify one of the example files
- Update the Inline Policy manually
- Or copy a JSON file over the top and use the linter to convert to Javascript

Policy is contained in the policy block:

``` js
// Inline policy from JSON
export const policy: InlinePolicy = {
    Version: '2012-10-17',
    Statement: [
        {
            Sid: 'ManageEc2',
            Effect: 'Allow',
            Action: [
                'ec2:RebootInstances',
                'ec2:StartInstances',
                'ec2:StopInstances',
            ],
            Resource: '*',
        },
        {
            Sid: 'AllowS3Objects',
            Effect: 'Allow',
            Action: [
                's3:PutObject',
                's3:GetObject',
            ],
            Resource: '*',
        },
    ],
};
```

You can copy JSON over the top of the block and simply use `Fix all auto-fixable problems` in the linter to re-format to JS.


### Policy Index and Settings

Policies and settings then need to be updated in `lib/data/index.ts`.

Add any new policies in the imports:

``` js
import { policy as examplePolicy1 } from './policies/example1';
import { policy as examplePolicy2 } from './policies/example2';
```

And modify settings in the permissionSets block:

``` js
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
```
Note the names of the accounts and groups must match those you have configured in `environment.ts`.

---
### Exporting Policies

You can export the configured Inline policies to JSON for review and manual testing if required:
- `npm run export-json`
- Policy files will be exported to the `exports` folder

---
### Costs and Cleanup

There is no cost to creating Organisations, Accounts, SSO or any of these Permission Sets.

To cleanup:
- `cdk destroy`
- Or delete the CloudFormation template in the master account
