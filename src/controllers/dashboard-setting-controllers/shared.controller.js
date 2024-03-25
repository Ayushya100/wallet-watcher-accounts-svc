'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: shared-setting';

const log = logger(header);
const registerLog = createNewLog(header);

const isSettingByIdAvailable = async(settingId) => {
    registerLog.createDebugLog('Get all settings info');

    try {
        log.info('Execution for getting settings info by id controller started');
        log.info('Call db query to get the details of setting record');
        const settingFound = await dbConnect.isSettingByIdAvailable(settingId);

        if (!settingFound) {
            log.error('Setting with given ID does not exist in database');
            return {
                resType: 'NOT_FOUND',
                resMsg: 'Setting does not found',
                isValid: false
            };
        }

        if (settingFound.length === 0) {
            log.info('Setting without any value returned from database');
            return {
                resType: 'CONTENT_NOT_AVAILABLE',
                resMsg: 'No User Available to Assign Setting',
                data: [],
                isValid: false
            };
        }

        log.info('Execution for getting Setting info found Successfully');
        return {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            data: settingFound,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to check for existing setting by id');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    isSettingByIdAvailable
};
