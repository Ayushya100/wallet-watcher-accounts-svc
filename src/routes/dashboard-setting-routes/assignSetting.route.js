'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: assign-setting';
const msg = 'Assign Setting Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controller.dashboardController;

// API Function
const assignSettingsToUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const settingId = req.params.id;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = dashboardController.validateAssignSettingPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if setting exists');
            const isSettingAvailable = await dashboardController.isSettingByIdAvailable(settingId);

            if (isSettingAvailable.isValid) {
                payload.settingId = isSettingAvailable.data._id || settingId;
                payload.type = isSettingAvailable.data?.type;

                log.info('Call controller function to assign setting to users');
                const isSettingAssigned = await dashboardController.assignSettingToUser(payload);

                if (isSettingAssigned.isValid) {
                    res.status(responseCodes[isSettingAssigned.resType]).json(
                        buildApiResponse(isSettingAssigned)
                    );
                } else {
                    log.error('Error while assigning setting to the users');
                    return next(isSettingAssigned);
                }
            } else {
                log.error('Error while checking if setting exists');
                return next(isSettingAvailable);
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

export default assignSettingsToUser;
