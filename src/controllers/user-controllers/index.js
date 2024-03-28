'use strict';

import {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateDeactivateUserPayload,
    validateProfileImagePayload,
    validateResetRequestPayload,
    validateResetPasswordPayload
} from './validatePayload.controller.js';
import {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
} from './createUser.controller.js';
import { checkUserById, checkUserByEmailOrUserName } from './shared.controller.js';
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
import {
    updateUserPassword,
    requestReset,
    resetPassword,
    sendUpdatePasswordMailPayload,
    sendPasswordLinkMailPayload
} from './updateUserPassword.controller.js';
import {
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload
} from './deactivateUser.controller.js';
import { updateProfileImage, deleteProfileImage } from './profileImage.controller.js';

export default {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateDeactivateUserPayload,
    validateProfileImagePayload,
    validateResetRequestPayload,
    validateResetPasswordPayload,
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
    sendUpdateDetailsMailPayload,
    updateUserPassword,
    sendUpdatePasswordMailPayload,
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload,
    updateProfileImage,
    deleteProfileImage,
    checkUserByEmailOrUserName,
    requestReset,
    resetPassword,
    sendPasswordLinkMailPayload
};
