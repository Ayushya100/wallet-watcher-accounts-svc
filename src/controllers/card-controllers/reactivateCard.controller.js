'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { decryptData, convertFullDateToString } from '../../utils/card.js';

const header = 'controller: reactivate-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const isCardValidToReactivate = (cardDetails) => {
    log.info('Execution for validating card before reactivating started');
    
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    log.info('Data decryption process is initiated');
    let expirationDate = decryptData(cardDetails.expirationDate);
    expirationDate = convertFullDateToString(expirationDate);
    expirationDate = new Date(expirationDate);
    log.info('Data has been successfully decrypted');

    if (expirationDate < new Date()) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'CARD ALREADY EXPIRED - CANNOT RE-ACTIVATE';
        response.isValid = false;
    }

    log.info('Execution for validating card completed');
    return response;
}

const reactivateCard = async(userId, cardToken) => {
    registerLog.createDebugLog('Start reactivating the card');

    try {
        log.info('Execution for reactivating a card started');
        log.info('Call db query to reactivate the card in database');
        const updatedCardInfo = await dbConnect.reactivateCard(userId, cardToken);

        log.info('Data decryption process is initiated');
        updatedCardInfo.holderName = decryptData(updatedCardInfo.holderName);
        updatedCardInfo.expirationDate = decryptData(updatedCardInfo.expirationDate);
        log.info('Data has been successfully decrypted');

        log.info('Call db query to get the user info from database');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for reactivating the card completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Card Reactivated Successfully',
            data:  {
                fullName: userInfo.firstName + ' ' + userInfo.lastName,
                emailId: userInfo.emailId,
                cardNumber: updatedCardInfo.cardNumber,
                holderName: updatedCardInfo.holderName,
                cardColor: updatedCardInfo.cardColor,
                isActive: updatedCardInfo.isActive
            },
            isValid: true
        };
    } catch (err) {
        log.error('Error while working with db to reactivate user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardReactivationMailPayload = (cardData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: cardData.emailId,
        emailType: 'CARD_REACTIVATION_MAIL',
        context: {
            fullName: cardData.fullName,
            cardNumber: cardData.cardNumber,
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}


export {
    isCardValidToReactivate,
    reactivateCard,
    sendCardReactivationMailPayload
};
