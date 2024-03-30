'use strict';

import validators from '../../assets/validators/payloadValidators.js';
import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validateCardNumber = (cardNumber) => {
    return validators.cardNumber.test(cardNumber);
}

const validateExpiryDate = (expiryDate) => {
    const expirationDate = new Date(expiryDate);
    const currentDate = new Date();
    return expirationDate > currentDate;
}

// Mandatory parameters check for registering new card
const validateRegisterCardPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFilds = ['cardNumber', 'cardType', 'bankInfo', 'expirationDate', 'holderName'];

    if (!payload.cardNumber || !payload.cardType || !payload.bankInfo || !payload.expirationDate || !payload.holderName) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required parameter is missing';
        response.isValid = false;

        for (const field of mandatoryFilds) {
            if (!payload[field]) {
                response.resMsg += ` - ${field}`;
                break;
            }
        }
    }

    if (!validateCardNumber(payload.cardNumber)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern Invalid. Card number incorrect';
        response.isValid = false;
    }

    if (!validateExpiryDate(payload.expirationDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Expiration Date must be greater than today's date`;
        response.isValid = false;
    }
    returnValidationConfirmation();
    return response;
}

export {
    validateRegisterCardPayload
}