'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: deassign-setting';
const msg = 'De-assign Setting Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controller.dashboardController;

// API Function
const deassignSetting = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const settingId = req.params.id;
        const usersId = req.body.userId;

        log.info('Call controller function to check if setting exists');
        const isSettingAvailable = await dashboardController.isSettingByIdAvailable(settingId);

        if (isSettingAvailable.isValid) {
            log.info('Call controller function to remove user assignment for the setting');
            const isSettingDeassigned = await dashboardController.deassignSettingFromUser(settingId, usersId);

            if (isSettingDeassigned.isValid) {
                registerLog.createInfoLog('Setting deassigned for users successfully', isSettingDeassigned);
                res.status(responseCodes[isSettingDeassigned.resType]).json(
                    buildApiResponse(isSettingDeassigned)
                );
            } else {
                log.error('Error while removing user assignment for setting exists');
                return next(isSettingDeassigned);
            }
        } else {
            log.error('Error while checking if setting exists');
            return next(isSettingAvailable);
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

export default deassignSetting;
