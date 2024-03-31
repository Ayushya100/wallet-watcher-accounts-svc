'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import {
    encryptAccountData,
    decryptAccountData
} from '../../utils/index.js';

const header = 'controller: update-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateAccountInfo = async(userId, accountToken, payload) => {
    registerLog.createDebugLog('Start updating account info');

    try {
        log.info('Execution for updating  user account information started');
        if (payload.accountDate) {
            payload.accountDate = encryptAccountData(payload.accountDate);
        }
        if (payload.holderName) {
            payload.holderName = encryptAccountData(payload.holderName);
        }

        log.info('Call db query to update user account information');
        const updatedAccountInfo = await dbConnect.updateExistingAccount(userId, accountToken, payload);
        
        log.info('Data decription process is initiated');
        updatedAccountInfo.accountName = decryptAccountData(String(updatedAccountInfo.accountName));
        updatedAccountInfo.accountDate = decryptAccountData(String(updatedAccountInfo.accountDate));
        updatedAccountInfo.holderName = decryptAccountData(String(updatedAccountInfo.holderName));
        log.info('Data decription completed successfully');

        log.info('Call db query to get the user information');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for updating user account information completed successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Account Info Updated',
            data: {
                _id: updatedAccountInfo._id,
                fullName: userInfo.firstName + ' ' + userInfo.lastName,
                emailId: userInfo.emailId,
                accountName: updatedAccountInfo.accountName,
                accountNumber: updatedAccountInfo.accountNumber,
                accountDate: updatedAccountInfo.accountDate,
                holderName: updatedAccountInfo.holderName,
                isActive: updatedAccountInfo.isActive
            },
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to update the information of requested account');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountUpdationMailPayload = (accountData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: accountData.emailId,
        emailType: 'ACCOUNT_UPDATION_MAIL',
        context: {
            fullName: accountData.fullName,
            accountNumber: accountData.accountNumber,
            holderName: accountData.holderName,
            accountDate: accountData.accountDate
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    updateAccountInfo,
    sendAccountUpdationMailPayload
};
