'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { decryptData, convertDateToString } from '../../utils/card.js';

const header = 'controller: get-card-info-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const getAllCardsInfo = async(userId) => {
    registerLog.createDebugLog('Start retrieving all cards info of user');

    try {
        log.info('Execution for retrieving card information started');
        log.info('Call db query to get card information from the database');
        const allCardInfo = await dbConnect.getAllCardInfo(userId);

        log.info('Data decription process is initiated');
        for (const cardInfo of allCardInfo) {
            cardInfo.cardType = decryptData(String(cardInfo.cardType));
            cardInfo.bankInfo = decryptData(String(cardInfo.bankInfo));
            cardInfo.holderName = decryptData(String(cardInfo.holderName));
            cardInfo.expirationDate = decryptData(String(cardInfo.expirationDate));
            cardInfo.expirationDate = convertDateToString(cardInfo.expirationDate);
        }
        log.info('Data decription completed successfully');

        if (allCardInfo.length > 0) {
            log.info('Execution for retrieving card information is successful');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: 'Card details found',
                data: allCardInfo,
                isValid: true
            };
        }

        log.error('No card information was retrieved in the database');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Card Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to retrieve user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const getCardInfoByToken = async(userId, cardToken) => {
    registerLog.createDebugLog('Start retrieving card info by token');

    try {
        log.info('Execution for retrieving card information started');
        log.info('Call db query to get card information from the database');
        let oneCardInfo = await dbConnect.getCardInfoByToken(userId, cardToken);

        if (oneCardInfo) {
            log.info('Data decription process is initiated');
            console.log(oneCardInfo);
            oneCardInfo.cardType = decryptData(oneCardInfo.cardType);
            oneCardInfo.bankInfo = decryptData(oneCardInfo.bankInfo);
            oneCardInfo.expirationDate = decryptData(oneCardInfo.expirationDate);
            oneCardInfo.holderName = decryptData(oneCardInfo.holderName);
            oneCardInfo.expirationDate = convertDateToString(oneCardInfo.expirationDate);
            log.info('Data decription completed successfully');

            log.info('Execution for retrieving card information completed successfully');
            return {
                resType: 'REQUEST_ACCEPTED',
                resMsg: 'Card details found',
                data: oneCardInfo,
                isValid: true
            };
        }

        log.error('No card information found in the database');
        return {
            resType: 'NOT_FOUND',
            resMsg: 'No Card Found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to retrieve specific user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

export {
    getAllCardsInfo,
    getCardInfoByToken
};
