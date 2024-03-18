'use strict';

import dbConnect from '../../db/index.js';
import { logger } from 'lib-common-service';

const log = logger('controller: create-setting');

const buildCheckSettingAvailableQuery = (payload) => {
    const queryFindParameter = {
        categoryName: payload.categoryName,
        categoryType: payload.categoryType,
        duration: payload.duration
    };
    return queryFindParameter;
}

const buildNewSettingQuery = (payload) => {
    const createQueryParameter = {
        categoryName: payload.categoryName,
        categoryDescription: payload.categoryDescription,
        categoryType: payload.categoryType,
        type: payload.type,
        isPeriodic: payload.isPeriodic,
        duration: payload.duration,
        createdBy: 'SYSTEM-NEW-SETTING'
    };

    return createQueryParameter;
}

const isSettingAvailable = async(payload) => {
    try {
        log.info('Execution for checking setting controller started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        const findParameter = buildCheckSettingAvailableQuery(payload);

        log.info('Call db query to check for the existing records');
        const settingDetails = await dbConnect.isSettingByNameAvailable(findParameter);

        if (settingDetails) {
            log.error('Conflict, record already exists');
            response.resType = 'CONFLICT';
            response.resMsg = 'Setting already exists with same name.';
            response.isValid = false;
        }

        log.info('Execution for existing record completed');
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
    try {
        log.info('Execution for registering new controller started');
        if (!payload.type) {
            payload.type = 'Boolean';
        }

        const createParameter = buildNewSettingQuery(payload);

        log.info('Call db query to register new records');
        const newSetting = await dbConnect.registerNewSetting(createParameter);

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
