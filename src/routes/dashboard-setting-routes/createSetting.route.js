'use strict';

import { buildApiResponse, responseCodes, logger } from 'lib-common-service';
import setting from '../../controllers/index.js';

const log = logger('route: create-setting');
const dashboardSetting = setting.dashboardSetting;

// API Function
const createSetting = async(req, res, next) => {
    log.info('Create Setting Router started');

    try {
        const payload = req.body;
        
        log.info('Call payload validator');
        const isValidPayload = dashboardSetting.validateCreateSettingPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check for existing record');
            const isSettingAvailable = await dashboardSetting.isSettingAvailable(payload);

            if (isSettingAvailable.isValid) {
                log.info('Call controller function to register new setting started');
                const isNewSettingCreated = await dashboardSetting.createSetting(payload);

                if (isNewSettingCreated.isValid) {
                    res.status(responseCodes[isNewSettingCreated.resType]).json(
                        buildApiResponse(isNewSettingCreated)
                    );
                } else {
                    return next(isNewSettingCreated);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isSettingAvailable);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch (err) {
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default createSetting;