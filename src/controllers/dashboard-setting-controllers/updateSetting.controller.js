'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: update-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const updateSettings = async(settingId, payload, settingDetails) => {
    registerLog.createDebugLog('Get all settings info');

    try {
        log.info('Execution for updating setting info controller started');
        const settingsPayload = {
            categoryName: payload.categoryName || settingDetails.categoryName,
            categoryDescription: payload.categoryDescription || settingDetails.categoryDescription,
            categoryType: payload.categoryType || settingDetails.categoryType,
            subCategory: payload.subCategory || settingDetails.subCategory,
            type: payload.type || settingDetails.type,
            isPeriodic: payload.isPeriodic || settingDetails.isPeriodic,
            duration: payload.duration || settingDetails.duration,
            modifiedOn: Date.now(),
            modifiedBy: payload.userId
        };

        log.info('Call db query to update the details of setting');
        const udpatedSettingDetails = await dbConnect.updateSettingDetails(settingId, settingsPayload);

        log.info('Execution for updating setting record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Setting Details Updated',
            data: udpatedSettingDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to update setting record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    updateSettings
};
