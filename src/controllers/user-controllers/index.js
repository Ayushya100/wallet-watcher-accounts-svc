'use strict';

import {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload
} from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './createUser.controller.js';
import { checkUserById } from './shared.controller.js';
import { verifyUser, sendVerificationSuccessfulMailPayload } from './verifyUser.controller.js';
import {
    isUserValid,
    isUserVerified,
    isUserActive,
    generateAccessAndRefreshTokens,
    sendAccountReactivationMailPayload
} from './loginUser.controller.js';

export default {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload,
    checkUserById,
    verifyUser,
    sendVerificationSuccessfulMailPayload,
    isUserValid,
    isUserVerified,
    isUserActive,
    generateAccessAndRefreshTokens,
    sendAccountReactivationMailPayload
};
