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
    validateUser
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
    validateUser
};
