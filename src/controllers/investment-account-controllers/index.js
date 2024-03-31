'use strict';

import { validateNewAccountPayload } from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload
} from './createAccount.controller.js';
import { getAllAccountInfo, getAccountInfoByToken } from './getAccountInfo.controller.js';

export default {
    validateNewAccountPayload,
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload,
    getAllAccountInfo,
    getAccountInfoByToken
};
