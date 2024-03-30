'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { encryptData, decryptData, convertDateToString } from '../../utils/card.js';

const header = 'controller: update-card-info-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const updateCardInfo = async(userId, cardToken, payload) => {
    registerLog.createDebugLog('Start retrieving all cards info of user');

    try {
        log.info('Execution for updating card information started');
        payload.holderName = encryptData(String(payload.holderName));

        log.info('Call db query to update card information from the database');
        let updatedCardInfo = await dbConnect.updateExistingCard(userId, cardToken, payload);

        log.info('Data decription process is initiated');
        updatedCardInfo.holderName = decryptData(updatedCardInfo.holderName);
        updatedCardInfo.expirationDate = decryptData(updatedCardInfo.expirationDate);
        const expirationDate = convertDateToString(updatedCardInfo.expirationDate);
        log.info('Data decription completed successfully');

        log.info('Call db query to get the user info from database');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for updating card information has been finished');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Card Info Updated',
            data: {
                fullName: userInfo.firstName + ' ' + userInfo.lastName,
                emailId: userInfo.emailId,
                cardNumber: updatedCardInfo.cardNumber,
                holderName: updatedCardInfo.holderName,
                cardColor: updatedCardInfo.cardColor,
                balance: updatedCardInfo.balance,
                expirationDate: expirationDate,
                isActive: updatedCardInfo.isActive
            },
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to updating user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardUpdationgMailPayload = (cardData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: cardData.emailId,
        emailType: 'CARD_UPDATION_MAIL',
        context: {
            fullName: cardData.fullName,
            cardNumber: cardData.cardNumber,
            expirationDate: cardData.expirationDate,
            holderName: cardData.holderName
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    updateCardInfo,
    sendCardUpdationgMailPayload
};
