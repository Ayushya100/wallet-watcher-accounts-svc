'use strict';

import {
    validateRegisterUserPayload,
    validateUserVerificationPayload
} from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './createUser.controller.js';
import { checkUserById } from './shared.controller.js';
import { verifyUser, sendVerificationSuccessfulMailPayload } from './verifyUser.controller.js';

export default {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload,
    checkUserById,
    verifyUser,
    sendVerificationSuccessfulMailPayload
};
