'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: create-setting';
const msg = 'Create Setting Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controller.dashboardController;
const userManagementController = controller.userManagementController;

// API Function
const updateSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const settingId = req.params.id;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = dashboardController.validateUpdateSettingPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserExists = await userManagementController.checkUserById(payload.userId);

            if (isUserExists.isValid) {
                log.info('Call controller function to check if setting exists');
                const isSettingAvailable = await dashboardController.isSettingByIdAvailable(settingId);
                
                if (isSettingAvailable.isValid) {
                    log.info('Call controller function to update the setting records');
                    const isSettingUpdated = await dashboardController.updateSettings(settingId, payload, isSettingAvailable.data);
                    
                    if (isSettingUpdated.isValid) {
                        registerLog.createInfoLog('Update setting details successfully', isSettingUpdated);
                        res.status(responseCodes[isSettingUpdated.resType]).json(
                            buildApiResponse(isSettingUpdated)
                        );
                    } else {
                        log.error('Error while updating setting records');
                        return next(isSettingUpdated);
                    }
                } else {
                    log.error('Error while checking if setting exists');
                    return next(isSettingAvailable);
                }
            } else {
                log.error('Error while checking for existing user');
                return next(isUserExists);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch(err) {
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default updateSetting;
