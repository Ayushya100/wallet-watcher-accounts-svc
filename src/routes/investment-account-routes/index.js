'use strict';

import createAccount from './createAccount.route.js';
import getAccountInfo from './getAccountInfo.route.js';
import updateAccountInfo from './updateAccountIinfo.route.js';
import deactivateAccount from './deactivateAccount.route.js';
import reactivateAccount from './reactivateAccount.route.js';

export default {
    createAccount,
    getAccountInfo,
    updateAccountInfo,
    deactivateAccount,
    reactivateAccount
};
