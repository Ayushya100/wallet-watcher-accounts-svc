'use strict';

// Add DB Models
import { DashboardSettingsModel, UserDashboardModel } from 'lib-common-service';

const isSettingByNameAvailable = async(payload) => {
    const settingDetails = await DashboardSettingsModel.findOne({
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        duration: payload.duration
    });

    return settingDetails;
}

const registerNewSetting = async(payload) => {
    return await DashboardSettingsModel.create({
        categoryName: payload.categoryName,
        categoryDescription: payload.categoryDescription,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        type: payload.type,
        isPeriodic: payload.isPeriodic,
        duration: payload.duration
    });
}

const getAllSettings = async() => {
    const settingDetails = await DashboardSettingsModel.find({
        isDeleted: false
    }).select(
        'categoryName categoryDescription categoryType subCategory type isPeriodic duration'
    );

    return settingDetails;
}

const isSettingByIdAvailable = async(settingId) => {
    const settingDetails = await DashboardSettingsModel.findById({
        _id: settingId,
        isDeleted: false
    }).select(
        'categoryName categoryDescription categoryType subCategory type isPeriodic duration'
    );
    return settingDetails;
}

const createUserDashboardSettings = async(userSettings) => {
    const createUserDashboard = await UserDashboardModel.create(userSettings);
    return createUserDashboard;
}

export {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    createUserDashboardSettings
};
