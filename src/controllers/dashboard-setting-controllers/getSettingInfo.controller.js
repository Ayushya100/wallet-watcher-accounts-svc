'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: create-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllSettings = async() => {
    registerLog.createDebugLog('Get all settings info');

    try {
        log.info('Execution for getting all settings info controller started');
        log.info('Call db query to get the details of all setting records');
        const settingDetails = await dbConnect.getAllSettings();

        if (settingDetails.length === 0) {
            log.info('No setting info available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Available to Assign Setting',
                data: [],
                isValid: false
            };
        }

        log.info('Execution for getting all setting info completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'All settings found',
            data: settingDetails,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get all setting record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getSettingInfoById = async(settingId) => {
    registerLog.createDebugLog('Get all settings info');

    try {
        log.info('Execution for getting setting info for provided id controller started');
        log.info('Call db query to get the detail of setting by provided id record');
        const settingFound = await dbConnect.isSettingByIdAvailable(settingId);

        if (!settingFound) {
            log.error('Setting for provided id not Found');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'Setting does not found',
                isValid: false
            };
        }

        if (settingFound.length === 0) {
            log.info('No setting info available');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Available to Assign Setting',
                data: [],
                isValid: false
            };
        }

        log.info('Execution for getting setting info by id completed successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            data: settingFound,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to get setting info by id record');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllSettings,
    getSettingInfoById
};
