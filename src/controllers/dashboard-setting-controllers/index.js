'use strict';

import { validateCreateSettingPayload } from './validatePayload.controller.js';
import { isSettingAvailable, createSetting } from './createSetting.controller.js';

export default {
    validateCreateSettingPayload,
    isSettingAvailable,
    createSetting
};
