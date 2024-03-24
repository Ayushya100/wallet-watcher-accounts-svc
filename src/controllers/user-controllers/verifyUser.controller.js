'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: verify-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Verify user
const verifyUser = async(payload) => {
    registerLog.createDebugLog('Start verifying the user');

    try {
        log.info('Execution for verifying user started');
        let currentTime = new Date(Date.now());

        log.info('Call db query to get the existing record');
        const userInfo = await dbConnect.isUserByIdAvailable(payload.userId);

        log.info('Check if verification code is valid');
        if ((userInfo.verificationCode === payload.verificationCode) && (currentTime <= userInfo.verificationCodeExpiry)) {
            const verifiedUser = await dbConnect.validateUser(payload.userId);

            log.info('Execution for verifying user completed');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'USER VERIFICATION SUCCESSFUL',
                data: verifiedUser,
                isValid: true
            };
        }

        log.error('Bad request, user verification failed');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'USER VERIFICATION FAILED',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to verify the user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendVerificationSuccessfulMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'VERIFICATION_SUCCESS_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
            contactNumber: userData.contactNumber,
            emailId: userData.emailId
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    verifyUser,
    sendVerificationSuccessfulMailPayload
};
