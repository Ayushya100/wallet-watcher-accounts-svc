'use strict';

import validators from '../../assets/validators/payloadValidators.js';
import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validateAccountNumber = (accountNumber) => {
    return validators.accountNumber.test(accountNumber);
}

const validateAccountDate = (accDate) => {
    const accountDate = new Date(accDate);
    const currentDate = new Date();
    return accountDate <= currentDate;
}

// Mandatory parameters check for new account
const validateNewAccountPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFilds = ['accountName', 'accountNumber', 'accountDate', 'holderName'];

    if (!payload.accountName || !payload.accountNumber || !payload.accountDate || !payload.holderName) {
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

    if (!validateAccountNumber(payload.accountNumber)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern Invalid. Account number incorrect';
        response.isValid = false;
    }

    if (!validateAccountDate(payload.accountDate)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Account Date must be smaller than or equal to today's date`;
        response.isValid = false;
    }
    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for updating account info
const validateUpdateAccountPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (payload.accountDate) {
        if (!validateAccountDate(payload.accountDate)) {
            response.resType = 'BAD_REQUEST';
            response.resMsg = `Account Date must be smaller than or equal to today's date`;
            response.isValid = false;
        }
    }
    returnValidationConfirmation();
    return response;
}

export {
    validateNewAccountPayload,
    validateUpdateAccountPayload
};
