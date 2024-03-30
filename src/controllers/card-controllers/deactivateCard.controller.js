'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { decryptData } from '../../utils/card.js';

const header = 'controller: deactivate-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const deactivateCard = async(userId, cardToken) => {
    registerLog.createDebugLog('Start deactivating the card');

    try {
        log.info('Execution for deactivating a card started');
        log.info('Call db query to deactivate the card in database');
        const updatedCardInfo = await dbConnect.deactivateCard(userId, cardToken);

        log.info('Data decryption process is initiated');
        updatedCardInfo.holderName = decryptData(updatedCardInfo.holderName);
        updatedCardInfo.expirationDate = decryptData(updatedCardInfo.expirationDate);
        log.info('Data has been successfully decrypted');

        log.info('Call db query to get the user info from database');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for deactivating the card finished successfully');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Card Deactivated Successfully',
            data: {
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
        log.error('Error while working with db to deactivate user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardDeactivationMailPayload = (cardData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: cardData.emailId,
        emailType: 'CARD_DEACTIVATION_MAIL',
        context: {
            fullName: cardData.fullName,
            cardNumber: cardData.cardNumber,
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    deactivateCard,
    sendCardDeactivationMailPayload
};
