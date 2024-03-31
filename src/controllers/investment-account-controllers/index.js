'use strict';

import { validateNewAccountPayload, validateUpdateAccountPayload } from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload
} from './createAccount.controller.js';
import { getAllAccountInfo, getAccountInfoByToken } from './getAccountInfo.controller.js';
import { updateAccountInfo, sendAccountUpdationMailPayload } from './updateAccountInfo.controller.js';

export default {
    validateNewAccountPayload,
    validateUpdateAccountPayload,
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload,
    getAllAccountInfo,
    getAccountInfoByToken,
    updateAccountInfo,
    sendAccountUpdationMailPayload
};
