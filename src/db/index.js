'use strict';

import {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    createUserDashboardSettings,
    updateSettingDetails
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
    updateSettingDetails,
    isUserByIdAvailable,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    logoutUser
};
