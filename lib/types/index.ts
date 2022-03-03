// Environment =============================================================

export type AccountList = {
    // label: accountnumber
    [name: string]: string,
};

export type GroupList = {
    // name: guid
    [name: string]: string,
};

export type Environment = {
    account: string,
    region: string,
    ssoInstanceArn: string,
};

// Inline Policy ===========================================================

type InlineStatement = {
    Sid?: string,
    Effect: 'Allow' | 'Deny',
    Action: string | string[],
    Resource: string | string[],
    Condition?: {
        [operator: string]: {
            [resource: string]: string,
        },
    },
};

export type InlinePolicy = {
    Version: string,
    Statement: InlineStatement[],
};

// Permission Set ========================================================

type SetDefinition = {
    name: string;
    description: string;
    sessionDuration: number; // Hours
    accounts: Array<keyof AccountList>;
    groups: Array<keyof GroupList>;
    includeAllAccounts?: boolean;
};

export type SetWithManagedPolicy = SetDefinition & {
    managedPolicies: string[];
    inlinePolicy?: InlinePolicy;
};

export type SetWithInlinePolicy = SetDefinition & {
    managedPolicies?: string[];
    inlinePolicy: InlinePolicy;
};
