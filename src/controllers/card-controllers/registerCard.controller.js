'use strict';

import dbConnect from '../../db/index.js';
import { logger, createNewLog } from 'lib-common-service';
import {
    maskCardNumber,
    generateToken,
    encryptData
} from '../../utils/index.js';

const header = 'controller: register-card-controller';

const log = logger(header);
const registerLog = createNewLog(header);

// Check for existing card with same card number
const checkCardByCardNumber = async(cardNumber) => {
    registerLog.createDebugLog('Start checking if card with same card number is available');

    try {
        log.info('Execution for checking card with provided card number started');
        let response = {
            resType: 'SUCCESS',
            resMsg: 'VALIDATION SUCCESSFULL',
            isValid: true
        };
    
        const maskedCardNumber = maskCardNumber(cardNumber);
        log.info('Call db query to get card information from the database');
        const isCardExist = await dbConnect.isCardByCardNumberAvailable(maskedCardNumber);
        if (isCardExist) {
            response.resType = 'CONFLICT';
            response.resMsg = 'Card already exists with same number.';
            response.isValid = false;
        }

        log.info('Execution for checking existing record completed');
        return response;
    } catch(err) {
        log.error('Error while working with db to check for existing card with provided card number.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

// Register new card
const registerNewCard = async(userId, payload) => {
    registerLog.createDebugLog('Start creating new card in the system');

    try {
        log.info('Execution for creating new card started');
        log.info('Execution for building card data started');
        payload.cardType = payload.cardType.toUpperCase();
        
        const expirationDate = payload.expirationDate;
        const [year, month] = payload.expirationDate.split('-').map(Number);
        const lastDateOfMonth = new Date(year, month, 0);
        lastDateOfMonth.setHours(23, 59, 59, 999);
        payload.expirationDate = lastDateOfMonth;

        const emailPayload = {
            bankInfo: payload.bankInfo,
            expirationDate: expirationDate,
            holderName: payload.holderName
        };
        
        const maskedCardNumber = maskCardNumber(payload.cardNumber);
        payload.cardNumber = maskedCardNumber;
        payload.token = generateToken(maskedCardNumber);
        payload.cardType = encryptData(String(payload.cardType));
        payload.bankInfo = encryptData(String(payload.bankInfo));
        payload.expirationDate = encryptData(String(payload.expirationDate));
        payload.holderName = encryptData(String(payload.holderName));
        log.info('Exeuction for building card data completed');
        
        log.info('Call db query to create new card');
        const newCard = await dbConnect.createNewCard(userId, payload);

        if (newCard) {
            log.info('Execution for creating new card in database completed successfully');
            emailPayload.cardNumber = maskedCardNumber;
            return {
                resType: 'REQUEST_COMPLETED',
                resMsg: 'Card created successfully',
                data: newCard,
                mailPayload: emailPayload,
                isValid: true
            };
        }

        log.error('Error while storing new card info into database');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'CARD CREATION FAILED. INTERNAL ERROR OCCURRED',
            isValid: false
        };
    } catch (err) {
        log.error('Error while working with db to store card in database.');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while working with db.',
            stack: err.stack,
            isValid: false
        };
    }
}

const sendCardCreationMailPayload = (userData, payload) => {
    log.info('Execution for creating payload for sending mail started');

    const mailPayload = {
        emailId: userData.emailId,
        emailType: 'CARD_REGISTRATION_MAIL',
        context: {
            fullName: userData.firstName + ' ' + userData.lastName,
            bankInfo: payload.bankInfo,
            expirationDate: payload.expirationDate,
            holderName: payload.holderName,
            cardNumber: payload.cardNumber
        }
    };

    log.info('Execution for creating mail payload completed');
    return mailPayload;
}

export {
    checkCardByCardNumber,
    registerNewCard,
    sendCardCreationMailPayload
};
