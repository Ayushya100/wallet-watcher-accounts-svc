'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import { decryptData } from '../../utils/card.js';

const header = 'controller: delete-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

const deleteCard = async(userId, cardToken) => {
    registerLog.createDebugLog('Start deleting the card');

    try {
        log.info('Execution for deleting a card started');
        log.info('Call db query to delete the card in database');
        const updatedCardInfo = await dbConnect.deleteCard(userId, cardToken);

        log.info('Data decryption process is initiated');
        updatedCardInfo.holderName = decryptData(updatedCardInfo.holderName);
        updatedCardInfo.expirationDate = decryptData(updatedCardInfo.expirationDate);
        log.info('Data has been successfully decrypted');

        log.info('Call db query to get the user info from database');
        const userInfo = await dbConnect.isUserByIdAvailable(userId);

        log.info('Execution for deleting the card finished');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'Card Deleted Successfully',
            data: {
                fullName: userInfo.firstName + ' ' + userInfo.lastName,
                emailId: userInfo.emailId,
                cardNumber: updatedCardInfo.cardNumber,
                holderName: updatedCardInfo.holderName,
                cardColor: updatedCardInfo.cardColor,
                isActive: updatedCardInfo.isActive,
                isDeleted: updatedCardInfo.isDeleted
            },
            isValid: true
        };
    } catch(err) {
        log.error('Error while working with db to delete user cards info');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardDeletionMailPayload = (cardData) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: cardData.emailId,
        emailType: 'CARD_DELETION_MAIL',
        context: {
            fullName: cardData.fullName,
            cardNumber: cardData.cardNumber
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    deleteCard,
    sendCardDeletionMailPayload
};
