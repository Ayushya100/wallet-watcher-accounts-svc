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

const updateSettingDetails = async(settingId, payload) => {
    const updatedDetails = await DashboardSettingsModel.findByIdAndUpdate(
        {
            _id: settingId
        },
        {
            $set: payload
        },
        {
            new: true
        }
    ).select(
        'categoryName categoryDescription categoryType type isPeriodic duration'
    );
    return updatedDetails;
}

const getUsersWithAssignedSetting = async(userIds, settingId) => {
    const usersAlreadyAssigned = await UserDashboardModel.find({
        userId: {
            $in: userIds
        },
        settingId: settingId,
        isDeleted: false
    }).select('userId');
    return usersAlreadyAssigned;
}

const getAllUsersWithAssignedSetting = async(settingId) => {
    const usersAssignedDetails = await UserDashboardModel.find({
        settingId: settingId,
        isDeleted: false
    }).select('userId');
    return usersAssignedDetails;
}

const deassignUserSettings = async(ids) => {
    const updatedSettingDetails = await UserDashboardModel.updateMany(
        {
            _id: {
                $in: ids
            },
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true,
                modifiedOn: Date.now(),
                modifiedBy: 'SYSTEM_DEASSIGN'
            }
        },
        {
            new: true
        }
    ).select(
        'settingId type value isDeleted'
    );
    return updatedSettingDetails;
}

export {
    isSettingByNameAvailable,
    registerNewSetting,
    getAllSettings,
    isSettingByIdAvailable,
    createUserDashboardSettings,
    updateSettingDetails,
    getUsersWithAssignedSetting,
    getAllUsersWithAssignedSetting,
    deassignUserSettings
};
