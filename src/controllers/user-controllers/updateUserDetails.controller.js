'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';

const header = 'controller: update-user-details-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Update user details
const updateUserDetails = async(userId, payload) => {
    registerLog.createDebugLog('Start operation to update user');

    try {
        log.info('Execution for updating user details started');
        log.info('Call db query to update user details');
        const updatedUserInfo = await dbConnect.updateUserInfo(userId, payload);
        
        log.info('Execution for updating details completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'User info updated successfully',
            data: updatedUserInfo,
            isValid: true
        };
    } catch (err) {
        log.error('Error while updating user details.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        };
    }
}

const sendUpdateDetailsMailPayload = (userData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'USER_UPDATED_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
            emailId: userData.emailId,
            contactNumber: userData.contactNumber,
            dob: userData.dob.toDateString(),
            bio: userData.bio,
            createdOn: userData.createdOn.toDateString(),
            lastLogin: userData.lastLogin.toDateString()
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    updateUserDetails,
    sendUpdateDetailsMailPayload
};
