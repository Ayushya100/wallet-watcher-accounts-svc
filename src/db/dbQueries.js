'use strict';

// Add DB Models
import { DashboardSettingsModels } from 'lib-common-service';

const isSettingByNameAvailable = async(findParameter) => {
    return await DashboardSettingsModels.findOne(findParameter);
}

const registerNewSetting = async(createParameter) => {
    return await DashboardSettingsModels.create(createParameter);
}

export {
    isSettingByNameAvailable,
    registerNewSetting
};
