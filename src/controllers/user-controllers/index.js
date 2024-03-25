'use strict';

import {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload
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
import { isTokenAvailableAndActive, refreshTokens } from './refreshAccessToken.controller.js';
import { logoutUser } from './logoutUser.controller.js';
import { updateUserDetails, sendUpdateDetailsMailPayload } from './updateUserDetails.controller.js';

export default {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
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
    sendAccountReactivationMailPayload,
    isTokenAvailableAndActive,
    refreshTokens,
    logoutUser,
    updateUserDetails,
    sendUpdateDetailsMailPayload
};
