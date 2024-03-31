'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { decryptAccountData } from '../../utils/index.js';

const header = 'controller: deactivate-account-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const deactivateAccount = async(userId, accountToken) => {
    registerLog.createDebugLog('Start deactivating the account');

    try {
        log.info('Execution for deactivating a account started');
        log.info('Call db query to deactivate the account in database');
        const updatedAccountInfo = await dbConnect.deactivateAccount(userId, accountToken);

        log.info('Data decryption process is initiated');
        updatedAccountInfo.accountName = decryptAccountData(String(updatedAccountInfo.accountName));
        updatedAccountInfo.accountDate = decryptAccountData(String(updatedAccountInfo.accountDate));
        updatedAccountInfo.holderName = decryptAccountData(String(updatedAccountInfo.holderName));
        log.info('Data has been successfully decrypted');

        log.info('Call db query to get the user info from database');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for deactivating the account finished successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Account Deactivated Successfully',
            data: {
                fullName: userInfo.firstName + ' ' + userInfo.lastName,
                emailId: userInfo.emailId,
                accountName: updatedAccountInfo.accountName,
                accountNumber: updatedAccountInfo.accountNumber,
                accountDate: updatedAccountInfo.accountNumber,
                holderName: updatedAccountInfo.holderName,
                isActive: updatedAccountInfo.isActive
            },
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to deactivate user account info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountDeactivationMailPayload = (accountData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: accountData.emailId,
        emailType: 'ACCOUNT_DEACTIVATION_MAIL',
        context: {
            fullName: accountData.fullName,
            accountNumber: accountData.accountNumber
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    deactivateAccount,
    sendAccountDeactivationMailPayload
};
