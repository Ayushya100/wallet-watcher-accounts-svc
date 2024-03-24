'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: shared-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const checkUserById = async(userId) => {
    registerLog.createDebugLog('Start checking if user is available');

    try {
        log.info('Execution for checking user with provided id started');
        const response = {
            resType: 'NOT_FOUND',
            resMsg: 'USER NOT FOUND',
            data: null,
            isValid: false
        };

        log.info('Call db query to check for the existing record');
        const isUserAvailable = await dbConnect.isUserByIdAvailable(userId);

        if (isUserAvailable) {
            response.resType = 'SUCCESS';
            response.resMsg = 'VALIDATION SUCCESSFUL';
            response.data = isUserAvailable;
            response.isValid = true;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing user with provided id.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    checkUserById
};
