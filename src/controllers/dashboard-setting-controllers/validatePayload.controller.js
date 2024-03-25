'use strict';

import { logger } from 'lib-common-service';

const log = logger('controller: validate-payload');

const returnValidationConfirmation = () => {
    log.info('Payload verification completed');
}

const validateCreateSettingPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    const mandatoryFields = ['categoryName', 'categoryDescription', 'categoryType', 'subCategory'];

    if (!payload.categoryName || !payload.categoryDescription || !payload.categoryType || !payload.subCategory || payload.isPeriodic === '') {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter is missing`;
        response.isValid = false;

        for(const field of mandatoryFields) {
            if (!payload[field]) {
                response.resMsg += `: ${field}`;
                break;
            }
        }
    }

    if (payload.isPeriodic && !payload.duration) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = `Required parameter cannot be empty - duration missing`;
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateUpdateSettingPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };

    if (!payload.userId) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'User Id is required';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

const validateAssignSettingPayload = (payload) => {
    let response = {
        resType: 'SUCCESS',
        resMsg: 'VALIDATION SUCCESSFULL',
        isValid: true
    };
    
    if (!payload.value) {
        response.resType = 'BAD_REQUEST';
        response.resMsg = 'Default Value is required';
        response.isValid = false;
    }

    returnValidationConfirmation();
    return response;
}

export {
    validateCreateSettingPayload,
    validateUpdateSettingPayload,
    validateAssignSettingPayload
};
