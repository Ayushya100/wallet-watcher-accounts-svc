'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: update-user-dashboard-setting';
const msg = 'Update User Setting Details Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userDashboardController = controller.userDashboardController;

// API Function
const updateUserDashboardSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const userSettingId = req.params.userSettingId;
        const payload = req.body;
        
        log.info('Call controller function to check user setting info by id');
        const isDashboardSettingsFound = await userDashboardController.getUserDashboardSettingById(userId, userSettingId);
        
        if (isDashboardSettingsFound.isValid) {
            payload.type = isDashboardSettingsFound.data[0].type;
            payload.value = ((payload.value !== null) || (payload.value !== undefined)) ? payload.value : isDashboardSettingsFound.data[0].value;
            log.info('Call controller function to update dashboard settings for the user');
            const isSettingsUpdated = await userDashboardController.updateUserDashboardSetting(userId, userSettingId, payload);
            
            if (isSettingsUpdated.isValid) {
                registerLog.createInfoLog('Successfully updated setting information', null, isSettingsUpdated);
                res.status(responseCodes[isSettingsUpdated.resType]).json(
                    buildApiResponse(isSettingsUpdated)
                );
            } else {
                log.error('Error while updating the user setting records');
                return next(isSettingsUpdated)
            }
        } else {
            log.error('Error while retrieving user setting records');
            return next(isDashboardSettingsFound);
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

export default updateUserDashboardSetting;
