'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: get-user-setting-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllUserDashboardSetting = async(userId) => {
    registerLog.createDebugLog('Get all user settings info');

    try {
        log.info('Execution for getting setting info for provided user id controller started');
        log.info('Call db query to get the detail of setting by provided user id record');
        const userDashboardSettings = await dbConnect.getDashboardSettingByUserId(userId);

        if (userDashboardSettings.length === 0) {
            log.info('No user setting info available - execution completed');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Setting Available to Display',
                data: [],
                isValid: true
            };
        } else if (userDashboardSettings.length > 0) {
            log.info('Execution for getting setting info by user id completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard setting details found',
                data: userDashboardSettings,
                isValid: true
            };
        }

        log.error('No setting info found for provided user id');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get all setting records');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getUserDashboardSettingById = async(userId, userSettingId ) => {
    registerLog.createDebugLog('Get user setting info by id');

    try {
        log.info('Execution for getting setting info for provided setting id controller started');
        log.info('Call db query to get the detail of setting by provided setting id record');
        const userDashboardSetting = await dbConnect.isUserSettingBySettingIdAvailable(userId, userSettingId);

        if (userDashboardSetting.length === 0) {
            log.info('No user setting info available - execution completed');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Setting Available to Display',
                data: [],
                isValid: true
            };
        } else if (userDashboardSetting.length > 0) {
            log.info('Execution for getting setting info by setting id completed successfully');
            return {
                resType: 'SUCCESS',
                resMsg: 'Dashboard setting details found',
                data: userDashboardSetting,
                isValid: true
            };
        }

        log.error('No setting info found for provided setting id');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Dashboard Setting Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to get setting record by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllUserDashboardSetting,
    getUserDashboardSettingById
};
