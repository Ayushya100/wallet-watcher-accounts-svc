'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import {
    decryptAccountData,
    convertFullDateToString
} from '../../utils/index.js';

const header = 'controller: get-card-info-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllAccountInfo = async(userId) => {
    registerLog.createDebugLog('Start checking user account info');
    
    try {
        log.info('Execution for retrieving all account information started');
        log.info('Call db query to get all account data of the user');
        const allAccountInfo = await dbConnect.getAllAccountInfo(userId);

        if (allAccountInfo.length > 0) {
            log.info('Data decription process is initiated');
            for (const accountInfo of allAccountInfo) {
                accountInfo.accountName = decryptAccountData(String(accountInfo.accountName));
                accountInfo.holderName = decryptAccountData(String(accountInfo.holderName));
                accountInfo.accountDate = decryptAccountData(String(accountInfo.accountDate));
                accountInfo.accountDate = convertFullDateToString(accountInfo.accountDate);
            }
            log.info('Data decription completed successfully');

            log.info('Execution for retrieving all account information is successful');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: 'Account details found',
                data: allAccountInfo,
                isValid: true
            };
        }

        log.error('No account details found in the database');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Account Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while retrieving the account information');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getAccountInfoByToken = async(userId, accountToken) => {
    registerLog.createDebugLog('Start getting specific account information by token');

    try {
        log.info('Execution for retrieving specific account information started');
        log.info('Call db query to get account info using userId and accountToken');
        const oneAccountInfo = await dbConnect.getAccountByToken(userId, accountToken);

        if (oneAccountInfo) {
            log.info('Data decription process is initiated');
            oneAccountInfo.accountName = decryptAccountData(String(oneAccountInfo.accountName));
            oneAccountInfo.holderName = decryptAccountData(String(oneAccountInfo.holderName));
            oneAccountInfo.accountDate = decryptAccountData(String(oneAccountInfo.accountDate));
            oneAccountInfo.accountDate = convertFullDateToString(oneAccountInfo.accountDate);
            log.info('Data decription completed successfully');

            log.info('Execution for retrieving specific account information completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: 'Account detail found',
                data: oneAccountInfo,
                isValid: true
            };
        }

        log.error('No account info found using provided userId and Token');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Account Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while retrieving the account details');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllAccountInfo,
    getAccountInfoByToken
};
