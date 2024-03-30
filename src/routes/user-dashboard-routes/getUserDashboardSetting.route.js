'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: get-user-dashboard-setting';
const msg = 'Get User Setting Details Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;
const userDashboardController = controller.userDashboardController;

// API Function
const getUserDashboardSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const userSettingId = req.params.userSettingId;

        log.info('Call controller function to check if user records available');
        const isUserExist = await userManagementController.checkUserById(userId);

        if (isUserExist.isValid) {
            if (!userSettingId) {
                log.info('Call controller function to get all user settings info');
                const isDashboardSettingsFound = await userDashboardController.getAllUserDashboardSetting(userId);

                if (isDashboardSettingsFound.isValid) {
                    registerLog.createInfoLog('Successfully returned all settings information', null, isDashboardSettingsFound);
                    res.status(responseCodes[isDashboardSettingsFound.resType]).json(
                        buildApiResponse(isDashboardSettingsFound)
                    );
                } else {
                    log.error('Error while retrieving all user setting records');
                    return next(isDashboardSettingsFound);
                }
            } else {
                log.info('Call controller function to get user setting info by id');
                const isDashboardSettingsFound = await userDashboardController.getUserDashboardSettingById(userId, userSettingId);

                if (isDashboardSettingsFound.isValid) {
                    registerLog.createInfoLog('Successfully returned setting information', null, isDashboardSettingsFound);
                    res.status(responseCodes[isDashboardSettingsFound.resType]).json(
                        buildApiResponse(isDashboardSettingsFound)
                    );
                } else {
                    log.error('Error while retrieving user setting records');
                    return next(isDashboardSettingsFound);
                }
            }
        } else {
            log.error('Error while checking for existing record');
            return next(isUserExist);
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

export default getUserDashboardSetting;
