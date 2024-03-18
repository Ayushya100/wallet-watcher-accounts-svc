'use strict';

// Add DB Models
import { DashboardSettingsModel } from 'lib-common-service';

const isSettingByNameAvailable = async(findParameter) => {
    return await DashboardSettingsModel.findOne(findParameter);
}

const registerNewSetting = async(createParameter) => {
    return await DashboardSettingsModel.create(createParameter);
}

export {
    isSettingByNameAvailable,
    registerNewSetting
};
