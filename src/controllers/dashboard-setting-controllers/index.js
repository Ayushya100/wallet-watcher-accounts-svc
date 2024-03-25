'use strict';

import {
    validateCreateSettingPayload,
    validateUpdateSettingPayload
} from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './createSetting.controller.js';
import { getAllSettings, getSettingInfoById } from './getSettingInfo.controller.js';
import { isSettingByIdAvailable } from './shared.controller.js';
import { updateSettings } from './updateSetting.controller.js';

export default {
    validateCreateSettingPayload,
    validateUpdateSettingPayload,
    isSettingAvailable,
    createSetting,
    getAllSettings,
    getSettingInfoById,
    isSettingByIdAvailable,
    updateSettings
};
