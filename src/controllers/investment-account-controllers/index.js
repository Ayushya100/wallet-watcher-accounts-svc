'use strict';

import { validateNewAccountPayload, validateUpdateAccountPayload } from './validatePayload.controller.js';
import {
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload
} from './createAccount.controller.js';
import { getAllAccountInfo, getAccountInfoByToken } from './getAccountInfo.controller.js';
import { updateAccountInfo, sendAccountUpdationMailPayload } from './updateAccountInfo.controller.js';
import { deactivateAccount, sendAccountDeactivationMailPayload } from './deactivateAccount.controller.js';
import { reactivateAccount, sendAccountReactivationMailPayload } from './reactivateAccount.controller.js';
import { deleteAccount, sendAccountDeletionMailPayload } from './deleteAccount.controller.js';

export default {
    validateNewAccountPayload,
    validateUpdateAccountPayload,
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload,
    getAllAccountInfo,
    getAccountInfoByToken,
    updateAccountInfo,
    sendAccountUpdationMailPayload,
    deactivateAccount,
    sendAccountDeactivationMailPayload,
    reactivateAccount,
    sendAccountReactivationMailPayload,
    deleteAccount,
    sendAccountDeletionMailPayload
};
