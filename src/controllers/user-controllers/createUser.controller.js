'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { FRONTEND_URL } from '../../constants.js';

const header = 'controller: create-user-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Check for existing user with provided userName or emailId
const checkUserByUserNameOrEmail = async(payload) => {
    registerLog.createDebugLog('Start checking if user is available');

    try {
        log.info('Execution for checking user with provided userName or emailId started');
        const emailId = payload.emailId;
        const userName = payload.userName;

        const response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        log.info('Call db query to check for the existing records');
        const isUserFound = await dbConnect.isUserByUserNameOrEmailAvailable(userName, emailId);

        if (isUserFound) {
            response.resType = 'CONFLICT';
            response.resMsg = 'User already exist with same username or emailId.',
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch(err) {
        log.error('Error while working with db to check for existing user with provided userName or emailId.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

// Create a new user and send verification mail
const createNewUser = async(payload) => {
    registerLog.createDebugLog('Start creating new user');

    try {
        log.info('Execution for creating new user started');
        log.info('Call db query to create new user');
        const newUser = await dbConnect.createNewUser(payload);

        log.info('Call db query to get all settings info');
        let allSettingsInfoToAdd = await dbConnect.getAllSettings();
        allSettingsInfoToAdd = allSettingsInfoToAdd.map((setting) => ({
            userId: newUser._id,
            settingId: setting._id,
            type: setting.type || 'Boolean',
            value: false
        }));

        log.info('Call db query to register all settings to newly created user');
        await dbConnect.createUserDashboardSettings(allSettingsInfoToAdd);

        if (newUser) {
            newUser.fullName = newUser.firstName + ' ' + newUser.lastName;

            log.info('Execution for registering new user completed');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'User Created Successfully',
                data: newUser,
                isValid: true
            };
        } else {
            log.error('Error while calling the db query to create new user');
            return {
                resType: 'INTERNAL_SERVER_ERROR',
                resMsg: 'USER CREATION FAILED. INTERNAL ERROR OCCURRED',
                isValid: false
            };
        }
    } catch (err) {
        log.error('Error while working with db to create new user');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendVerificationMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_VERIFICATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            verificationCode: FRONTEND_URL + '/verify-user/' + userData._id + '/' + userData.verificationCode
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    checkUserByUserNameOrEmail,
    createNewUser,
    sendVerificationMailPayload
};
