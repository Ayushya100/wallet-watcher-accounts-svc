'use strict';

import createSetting from './createSetting.route.js';
import getSettingInfo from './getSettingInfo.route.js';
import updateSetting from './updateSetting.route.js';
import assignSettingsToUser from './assignSetting.route.js';
import deassignSetting from './deassignSettingFromUser.route.js';

export default {
    createSetting,
    getSettingInfo,
    updateSetting,
    assignSettingsToUser,
    deassignSetting
};
