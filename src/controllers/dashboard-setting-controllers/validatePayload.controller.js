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

    const mandatoryFields = ['categoryName', 'categoryDescription', 'categoryType'];

    if (!payload.categoryName || !payload.categoryDescription || !payload.categoryType || payload.isPeriodic === '') {
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

export {
    validateCreateSettingPayload
};
