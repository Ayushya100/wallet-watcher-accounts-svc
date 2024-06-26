'use strict';

import {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    createUserDashboardSettings,
    updateSettingDetails,
    getUsersWithAssignedSetting,
    getAllUsersWithAssignedSetting,
    deassignUserSettings,
    getDashboardSettingByUserId,
    isUserSettingBySettingIdAvailable,
    updateUserDashboardSetting
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
    logoutUser,
    getSelectedUsersId,
    getAllUsersId,
    updateUserInfo,
    updateUserPassword,
    isPasswordValid,
    getCompleteUserInfoById,
    userDeactivate,
    updateProfileImage,
    deleteProfileImage,
    generatePasswordCode,
    resetUserPassword
} from './users.db.js';
import {
    isCardByCardNumberAvailable,
    createNewCard,
    getAllCardInfo,
    getCardInfoByToken,
    updateExistingCard,
    deactivateCard,
    reactivateCard,
    deleteCard
} from './cards.db.js';
import {
    isAccountByAccNumberAvailable,
    createAccount,
    getAllAccountInfo,
    getAccountByToken,
    updateExistingAccount,
    deactivateAccount,
    reactivateAccount,
    deleteAccount
} from './accounts.db.js';

export default {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    isUserByUserNameOrEmailAvailable,
    createNewUser,
    createUserDashboardSettings,
    updateSettingDetails,
    getUsersWithAssignedSetting,
    getAllUsersWithAssignedSetting,
    deassignUserSettings,
    getDashboardSettingByUserId,
    isUserSettingBySettingIdAvailable,
    updateUserDashboardSetting,
    isUserByIdAvailable,
    validateUser,
    verifyPassword,
    generateVerificationCode,
    reactivateUser,
    generateAccessAndRefreshTokens,
    logoutUser,
    getSelectedUsersId,
    getAllUsersId,
    updateUserInfo,
    updateUserPassword,
    isPasswordValid,
    getCompleteUserInfoById,
    userDeactivate,
    updateProfileImage,
    deleteProfileImage,
    generatePasswordCode,
    resetUserPassword,
    isCardByCardNumberAvailable,
    createNewCard,
    getAllCardInfo,
    getCardInfoByToken,
    updateExistingCard,
    deactivateCard,
    reactivateCard,
    deleteCard,
    isAccountByAccNumberAvailable,
    createAccount,
    getAllAccountInfo,
    getAccountByToken,
    updateExistingAccount,
    deactivateAccount,
    reactivateAccount,
    deleteAccount
};
