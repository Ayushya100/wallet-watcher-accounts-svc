'use strict';

import createUser from './createUser.route.js';
import verifyUser from './verifyUser.route.js';
import loginUser from './loginUser.route.js';
import getUserInfo from './getUserInfo.route.js';
import refreshAccessToken from './refreshAccessToken.route.js';
import logoutUser from './logoutUser.route.js';
import updateUserDetails from './updateUserDetails.route.js';
import updateUserPassword from './updateUserPassword.route.js';
import deactivateUser from './deactivateUser.route.js';
import updateProfileImage from './updateProfileImage.route.js';
import deleteProfileImage from './deleteProfileImage.route.js';
import requestPasswordReset from './requestPasswordReset.route.js';

export default {
    createUser,
    verifyUser,
    loginUser,
    getUserInfo,
    refreshAccessToken,
    logoutUser,
    updateUserDetails,
    updateUserPassword,
    deactivateUser,
    updateProfileImage,
    deleteProfileImage,
    requestPasswordReset
};
