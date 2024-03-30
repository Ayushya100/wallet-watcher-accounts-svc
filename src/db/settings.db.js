'use strict';

import mongoose from 'mongoose';

// Add DB Models
import {
    DashboardSettingsModel,
    UserDashboardModel,
    executeQuery,
    executeAggregation
} from 'lib-common-service';

const isSettingByNameAvailable = async(payload) => {
    const settingDetails = DashboardSettingsModel.findOne({
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        subCategory: payload.subCategory,
        duration: payload.duration
    });
    return await executeQuery(settingDetails);
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
    const settingDetails = DashboardSettingsModel.find({
        isDeleted: false
    }).select(
        'categoryName categoryDescription categoryType subCategory type isPeriodic duration'
    );
    return await executeQuery(settingDetails);
}

const isSettingByIdAvailable = async(settingId) => {
    const settingDetails = DashboardSettingsModel.findById({
        _id: settingId,
        isDeleted: false
    }).select(
        'categoryName categoryDescription categoryType subCategory type isPeriodic duration'
    );
    return await executeQuery(settingDetails);
}

const createUserDashboardSettings = async(userSettings) => {
    const createUserDashboard = await UserDashboardModel.create(userSettings);
    return createUserDashboard;
}

const updateSettingDetails = async(settingId, payload) => {
    const updatedDetails = DashboardSettingsModel.findByIdAndUpdate(
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
    return await executeQuery(updatedDetails);
}

const getUsersWithAssignedSetting = async(userIds, settingId) => {
    const usersAlreadyAssigned = UserDashboardModel.find({
        userId: {
            $in: userIds
        },
        settingId: settingId,
        isDeleted: false
    }).select('userId');
    return await executeQuery(usersAlreadyAssigned);
}

const getAllUsersWithAssignedSetting = async(settingId) => {
    const usersAssignedDetails = UserDashboardModel.find({
        settingId: settingId,
        isDeleted: false
    }).select('userId');
    return await executeQuery(usersAssignedDetails);
}

const deassignUserSettings = async(ids) => {
    const updatedSettingDetails = UserDashboardModel.updateMany(
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
    return await executeQuery(updatedSettingDetails);
}

const getDashboardSettingByUserId = async(userId) => {
    const isSettingAvailable = UserDashboardModel.aggregate([
        {
            $match: {
                userId: new mongoose.mongoose.Types.ObjectId(userId),
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: 'dashboardsettings',
                localField: 'settingId',
                foreignField: '_id',
                as: 'dashboard'
            }
        },
        {
            $match: {
                'dashboard.isDeleted': false
            }
        },
        {
            $addFields: {
                categoryName: {
                    $arrayElemAt: ['$dashboard.categoryName', 0]
                },
                categoryDescription: {
                    $arrayElemAt: ['$dashboard.categoryDescription', 0]
                },
                categoryType: {
                    $arrayElemAt: ['$dashboard.categoryType', 0]
                },
                subCategory: {
                    $arrayElemAt: ['$dashboard.subCategory', 0]
                },
                isPeriodic: {
                    $arrayElemAt: ['$dashboard.isPeriodic', 0]
                },
                duration: {
                    $arrayElemAt: ['$dashboard.duration', 0]
                }
            }
        },
        {
            $project: {
                categoryName: 1,
                categoryDescription: 1,
                categoryType: 1,
                subCategory: 1,
                type: 1,
                value: 1,
                isPeriodic: 1,
                duration: 1
            }
        }
    ]);
    return await executeAggregation(isSettingAvailable);
}

const isUserSettingBySettingIdAvailable = async(userId, settingId) => {
    const isSettingAvailable = UserDashboardModel.aggregate([
        {
            $match: {
                _id: new mongoose.mongoose.Types.ObjectId(settingId),
                userId: new mongoose.mongoose.Types.ObjectId(userId),
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: 'dashboardsettings',
                localField: 'settingId',
                foreignField: '_id',
                as: 'dashboard'
            }
        },
        {
            $match: {
                'dashboard.isDeleted': false
            }
        },
        {
            $addFields: {
                categoryName: {
                    $arrayElemAt: ['$dashboard.categoryName', 0]
                },
                categoryDescription: {
                    $arrayElemAt: ['$dashboard.categoryDescription', 0]
                },
                categoryType: {
                    $arrayElemAt: ['$dashboard.categoryType', 0]
                },
                subCategory: {
                    $arrayElemAt: ['$dashboard.subCategory', 0]
                },
                isPeriodic: {
                    $arrayElemAt: ['$dashboard.isPeriodic', 0]
                },
                duration: {
                    $arrayElemAt: ['$dashboard.duration', 0]
                }
            }
        },
        {
            $project: {
                categoryName: 1,
                categoryDescription: 1,
                categoryType: 1,
                subCategory: 1,
                type: 1,
                value: 1,
                isPeriodic: 1,
                duration: 1
            }
        }
    ]);
    return await executeAggregation(isSettingAvailable);
}

const updateUserDashboardSetting = async(userId, userSettingId, payload) => {
    const updatedDashboardSettings = await UserDashboardModel.findByIdAndUpdate(
        {
            _id: userSettingId,
            userId: userId
        },
        {
            $set: {
                value: payload.value,
                modifiedOn: Date.now(),
                modifiedBy: userId
            }
        },
        {
            new: true
        }
    ).select(
        '-createdOn -createdBy -modifiedOn -modifiedBy -isDeleted'
    );
    return updatedDashboardSettings;
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
    deassignUserSettings,
    getDashboardSettingByUserId,
    isUserSettingBySettingIdAvailable,
    updateUserDashboardSetting
};
