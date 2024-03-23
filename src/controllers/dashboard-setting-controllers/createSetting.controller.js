'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: create-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const isSettingAvailable = async(payload) => {
    registerLog.createDebugLog('Start checking if the setting is available');

    try {
        log.info('Execution for checking setting controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const settingDetails = await dbConnect.isSettingByNameAvailable(payload);

        if (settingDetails) {
            log.error('Conflict, record already exists');
            response.resType = 'CONFLICT';
            response.resMsg = 'Setting already exists with same name.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch(err) {
        log.error('Error while working with db to check for existing similar setting record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const createSetting = async(payload) => {
    registerLog.createDebugLog('Start creating new setting');

    try {
        log.info('Execution for registering new controller started');
        payload.type = payload.type || 'Boolean';

        log.info('Call db query to register new records');
        const newSetting = await dbConnect.registerNewSetting(payload);

        log.info('Execution for new record completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Setting Created Successfully',
            data: newSetting,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to register new setting record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isSettingAvailable,
    createSetting
};
