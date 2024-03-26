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

const validContactNumber = (number) => {
    return validators.contactNumber.test(number);
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

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for registering new user
const validateUserLoginPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.userNameOrEmail) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required parameter is missing: UserName of EmailId should be provided';
        response.isValid = false;
    }
    
    if (!payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required parameter is missing: password';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameter check for updating user details
const validateUserDetailsPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (payload.contactNumber && !validContactNumber(payload.contactNumber)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. Contact Number incorrect';
        response.isValid = false;
    }
    
    if (payload.userName !== '' && payload.userName !== undefined && !validUserName(payload.userName)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. Username incorrect';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for updating user password
const validatePasswordUpdatePayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.oldPassword || !payload.newPassword) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required Parameters are missing';
        response.isValid = false;
    }

    if (!validPassword(payload.newPassword)) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Pattern invalid. New Password incorrect';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameters check for deactivate user
const validateDeactivateUserPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.userName || !payload.password) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required Parameters are missing';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

// Mandatory parameter check for updating profile image
const validateProfileImagePayload = (profileImagePath) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };
    
    if (!profileImagePath) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Required Parameter is missing';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateRegisterUserPayload,
    validateUserVerificationPayload,
    validateUserLoginPayload,
    validateUserDetailsPayload,
    validatePasswordUpdatePayload,
    validateDeactivateUserPayload,
    validateProfileImagePayload
};
