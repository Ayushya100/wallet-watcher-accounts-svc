'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: update-user-password-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateUserPassword = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to update user password');

    try {
        log.info('Execution for updating user password started');

        if (payload.oldPassword !== payload.newPassword) {
            log.info('Call db query to update user password');
            const isPasswordUpdated = await dbConnect.updateUserPassword(userId, payload);

            if (isPasswordUpdated) {
                log.info('Execution for updating user password completed');
                return {
                    resType: 'REQUEST_COMPLETED',
                    resMsg: 'PASSWORD UPDATED',
                    data: isPasswordUpdated,
                    isValid: true
                };
            }

            log.error('Unauthorized access - password does not match');
            return {
                resType: 'UNAUTHORIZED',
                resMsg: 'UNAUTHORIZED USER - Password does not match',
                isValid: false
            }
        }

        log.error('New password and old password are same');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'NEW PASSWORD CANNOT BE SAME AS OLD',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to logout user.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const sendUpdatePasswordMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_PASSWORD_UPDATED_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    updateUserPassword,
    sendUpdatePasswordMailPayload
};
