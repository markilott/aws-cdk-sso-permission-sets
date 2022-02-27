// Environment =============================================================

export type AccountList = {
    // label: accountnumber
    [key: string]: string,
};

export type GroupList = {
    // name: guid
    [key: string]: string,
};

export type Environment = {
    account: string,
    region: string,
    ssoInstanceArn: string,
};

// Inline Policy ===========================================================

type Condition = {
    [key: string]: {
        [key: string]: string | string[],
    },
};

type Effect = 'Allow' | 'Deny';

type InlineStatement = {
    Sid?: string,
    Effect: Effect,
    Action: string | string[],
    Resource: string | string[],
};

type InlineStatementWithCondition = InlineStatement & {
    Condition: Condition,
};

export type InlinePolicy = {
    Version: string,
    Statement: (InlineStatement | InlineStatementWithCondition)[],
};

// Permission Set ========================================================

type SetDefinition = {
    name: string;
    description: string;
    sessionDuration: number; // Hours
    accounts: Array<keyof AccountList>;
    groups: Array<keyof GroupList>;
};

export type SetWithManagedPolicy = SetDefinition & {
    managedPolicies: string[];
    inlinePolicy?: InlinePolicy;
};

export type SetWithInlinePolicy = SetDefinition & {
    managedPolicies?: string[];
    inlinePolicy: InlinePolicy;
};
