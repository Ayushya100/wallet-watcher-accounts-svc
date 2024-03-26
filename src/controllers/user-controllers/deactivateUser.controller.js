'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: deactivate-user';

const log = logger(header);
const registerLog = createNewLog(header);

// Validate user
const validateUserCredentials = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to validate user credentials');

    try {
        log.info('Execution for validating user credentials started');
        log.info('Call db query to get user info');
        const userInfo = await dbConnect.getCompleteUserInfoById(userId);

        if (!userInfo.isDeleted) {
            log.info('Call db query to validate user password');
            if ((userInfo.userName == payload.userName) && (await dbConnect.isPasswordValid(userInfo, payload.password))) {
                log.info('User credential validation successfull');
                return {
                    resType: 'SUCCESS',
                    resMsg: 'VALIDATION SUCCESSFULL',
                    isValid: true
                };
            }

            log.error('Unauthorized access - credentials invalid');
            return {
                resType: 'UNAUTHORIZED',
                resMsg: 'CREDENTIALS INVALID',
                isValid: false
            };
        }

        log.error('User is already deactivated - cannot process the new request to deactivate');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'User Already Deactive',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to validate user.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const deactivateUser = async(userId) => {
    registerLog.createDebugLog('Start operation to deactivate user');

    try {
        log.info('Execution for deactivating user started');
        log.info('Call db query to deactivate user');
        const isUserDeactivated = await dbConnect.userDeactivate(userId);

        if (isUserDeactivated) {
            log.info('User deactivated successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'USER DEACTIVATED',
                data: isUserDeactivated,
                isValid: true
            };
        }

        log.error('Failed to deactivate the user');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'OPERATION FAILED',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to deactivate user.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountDeactivateMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');
    const modifiedOn = userData.modifiedOn;

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_DEACTIVATE_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            dateOfDeactivation: modifiedOn.toDateString(),
            reactivationTimeline: new Date(modifiedOn.setDate(modifiedOn.getDate() + 30)).toDateString()
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export{
    validateUserCredentials,
    deactivateUser,
    sendAccountDeactivateMailPayload
};
