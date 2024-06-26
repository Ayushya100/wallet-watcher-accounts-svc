'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: create-setting';
const msg = 'Create Setting Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controller.dashboardController;

// API Function
const createSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;
        
        log.info('Call payload validator');
        const isValidPayload = dashboardController.validateCreateSettingPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check for existing record');
            const isSettingAvailable = await dashboardController.isSettingAvailable(payload);

            if (isSettingAvailable.isValid) {
                log.info('Call controller function to register new setting started');
                const isNewSettingCreated = await dashboardController.createSetting(payload);

                if (isNewSettingCreated.isValid) {
                    registerLog.createInfoLog('New setting created successfully', null, isNewSettingCreated);
                    res.status(responseCodes[isNewSettingCreated.resType]).json(
                        buildApiResponse(isNewSettingCreated)
                    );
                } else {
                    log.error('Error while creating new setting record in db');
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
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default createSetting;