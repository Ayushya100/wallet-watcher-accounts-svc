'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { FRONTEND_URL } from '../../constants.js';

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
        log.error('Error while working with db to update user password.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const requestReset = async(user) => {
    registerLog.createDebugLog('Start operation to send password reset request');

    try {
        log.info('Execution for sending password reset link started');

        log.info('Call db query to generate forgot password token');
        const updatedUserInfo = await dbConnect.generatePasswordCode(user._id);

        log.info('Reset token generated successfully')
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'RESET LINK SENT',
            data: updatedUserInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to send link to user for password reset.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const resetPassword = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to update user password');

    try {
        log.info('Execution for updating user password started');
        let currentTime = new Date(Date.now());

        log.info('Call db query to get the existing record');
        const userInfo = await dbConnect.getCompleteUserInfoById(userId);

        log.info(`Start user verification - current time : ${currentTime}`);
        if ((payload.verificationCode === userInfo.forgotPasswordToken) && (currentTime <= userInfo.forgotPasswordTokenExpiry)) {
            log.info('Call db query to verify is the new password is same as old');
            const isPasswordSame = await dbConnect.verifyPassword(userInfo, payload.password);

            if (!isPasswordSame) {
                log.info('Call db query to update the user password');
                const isPasswordUpdated = await dbConnect.resetUserPassword(userId, payload.password);
                
                log.info('Execution for updating user password completed');
                return {
                    resType: 'REQUEST_COMPLETED',
                    resMsg: 'PASSWORD RESET SUCCESSFULL',
                    data: isPasswordUpdated,
                    isValid: true
                };
            }
            log.error('New password is same as old - cannot be processed further');
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'NEW PASSWORD CANNOT BE SAME AS OLD',
                isValid: false
            };
        }

        log.error('Bad request, user verification failed');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'USER VERIFICATION FAILED',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to update user password.');
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

const sendPasswordLinkMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'PASSWORD_RESET_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            custId: userData._id,
            emailId: userData.emailId,
            verificationCode: FRONTEND_URL + '/reset-password/' + userData._id + '/' + userData.forgotPasswordToken
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    updateUserPassword,
    requestReset,
    resetPassword,
    sendUpdatePasswordMailPayload,
    sendPasswordLinkMailPayload
};
