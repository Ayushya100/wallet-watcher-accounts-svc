'use strict';

import validators from '../../assets/validators/payloadValidators.js';
import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validUserName = (userName) => {
    return validators.userName.test(userName);
}

const validEmailId = (emailId) => {
    return validators.email.test(emailId);
}

const validPassword = (password) => {
    return validators.password.test(password);
}

// Mandatory parameters check for registering new user
const validateRegisterUserPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true,
        data: payload
    };

    const mandatoryFilds = ['firstName', 'userName', 'emailId', 'password'];

    if (!payload.firstName || !payload.userName || !payload.emailId || !payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required Parameter is missing';
        response.isValid = false;

        for (const field of mandatoryFilds) {
            if (!payload[field]) {
                response.resMsg += `: ${field}`;
                break;
            }
        }
    }

    if (!validUserName(payload.userName)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. Username incorrect';
        response.isValid = false;
    }
    
    if (!validEmailId(payload.emailId)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. Email ID incorrect';
        response.isValid = false;
    }

    if (!validPassword(payload.password)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. Password incorrect';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for verifying new user
const validateUserVerificationPayload = (verificationCode) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!verificationCode) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required parameter is missing';
        response.isValid = false;
    }

    return response;
}

export {
    validateRegisterUserPayload,
    validateUserVerificationPayload
};
