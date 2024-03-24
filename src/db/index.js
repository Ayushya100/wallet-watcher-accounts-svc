'use strict';

import {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    createUserDashboardSettings
} from './settings.db.js';
import {
    isUserByUserNameOrEmailAvailable,
    createNewUser,
    isUserByIdAvailable,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    logoutUser
} from './users.db.js';

export default {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    isUserByUserNameOrEmailAvailable,
    createNewUser,
    createUserDashboardSettings,
    isUserByIdAvailable,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    logoutUser
};
