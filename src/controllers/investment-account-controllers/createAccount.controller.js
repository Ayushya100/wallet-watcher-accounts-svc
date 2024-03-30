'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import {
    maskAccountNumber,
    generateAccountToken,
    encryptAccountData
} from '../../utils/index.js';

const header = 'controller: register-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Check for existing account with same number
const checkAccountByAccNumber = async(accountNumber) => {
    registerLog.createDebugLog('Start checking if account with same account number is available');

    try {
        log.info('Execution for checking account with provided account number started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };

        const maskedAccountNumber = maskAccountNumber(accountNumber);
        log.info('Call db query to get account information from the database');
        const accountInfo = await dbConnect.isAccountByAccNumberAvailable(maskedAccountNumber);

        if (accountInfo) {
            response.resType = 'CONFLICT';
            response.resMsg = 'Account already exists with same number.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch (err) {
        log.error('Error while working with db to check for existing account with provided account number.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

// Create new account
const createAccount = async(userId, payload) => {
    registerLog.createDebugLog('Start creating new account in the system');

    try {
        log.info('Execution for creating new account started');
        log.info('Execution for building account data started');
        const emailPayload = {
            accountName: payload.accountName,
            accountNumber: payload.accountNumber,
            accountDate: payload.accountDate,
            holderName: payload.holderName
        };

        const maskedAccountNumber = maskAccountNumber(String(payload.accountNumber));
        payload.accountNumber = maskedAccountNumber;
        payload.token = generateAccountToken(maskedAccountNumber);
        payload.accountName = encryptAccountData(String(payload.accountName));
        payload.holderName = encryptAccountData(String(payload.holderName));
        
        payload.accountDate = new Date(payload.accountDate);
        payload.accountDate = encryptAccountData(String(payload.accountDate));
        log.info('Exeuction for building account data completed');

        log.info('Call db query to create new account');
        const newAccount = await dbConnect.createAccount(userId, payload);

        if (newAccount) {
            log.info('Execution for creating new account in database completed successfully');
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Account Created Successfully',
                data: newAccount,
                mailPayload: emailPayload,
                isValid: true
            };
        }

        log.error('Error while storing new account info into database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'ACCOUNT CREATION FAILED. INTERNAL ERROR OCCURRED',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to store account in database.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendAccountCreationMailPayload = (userData, payload) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'ACCOUNT_REGISTRATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            accountName: payload.accountName,
            accountNumber: payload.accountNumber,
            holderName: payload.holderName,
            accountDate: payload.accountDate
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    checkAccountByAccNumber,
    createAccount,
    sendAccountCreationMailPayload
};
