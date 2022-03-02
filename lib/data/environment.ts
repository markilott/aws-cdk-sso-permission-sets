import { Environment, AccountList, GroupList } from '../types';

/**
 * The Organisation master account (where the SSO configuration resides)
 */
export const environment: Environment = {
    account: '123456777',
    region: 'us-east-2',
    ssoInstanceArn: 'arn:aws:sso:::instance/ssoins-xxxxxxxxxxxxxxxxx',
};

/**
 * List of Accounts where we want to assign permission sets
 */
export const accountList: AccountList = {
    master: '123456777',
    prod: '123456888',
    dev: '123456999',
};

/**
 * List of Groups we want to assign permission sets to
 */
export const groupList: GroupList = {
    Developers: '9a67298558-5b31f15d-c107-4be6-a115-xxxxxxxxxxxx',
    ReadOnly: '9a67298558-8fb7193d-7b2f-4161-a372-xxxxxxxxxxxx',
};
