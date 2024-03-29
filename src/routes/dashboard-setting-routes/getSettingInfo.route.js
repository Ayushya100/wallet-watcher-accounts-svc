'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: get-setting-info';
const msg = 'Get Setting Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const dashboardController = controller.dashboardController;

// API Function
const getSettingInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const settingId = req.params.id;

        if (!settingId) {
            log.info('Call controller function to get all settings info');
            const isAllSettingsFound = await dashboardController.getAllSettings();

            if (isAllSettingsFound.isValid) {
                registerLog.createInfoLog('Successfully returned all settings information', null, isAllSettingsFound);
                res.status(responseCodes[isAllSettingsFound.resType]).json(
                    buildApiResponse(isAllSettingsFound)
                );
            } else {
                log.error('Error while retrieving setting records from db');
                return next(isAllSettingsFound);
            }
        } else {
            log.info('Call controller function to get the setting info by id');
            const isSettingInfoFound = await dashboardController.getSettingInfoById(settingId);

            if (isSettingInfoFound.isValid) {
                registerLog.createInfoLog('Successfully returned the requested setting information', null, isSettingInfoFound);
                res.status(responseCodes[isSettingInfoFound.resType]).json(
                    buildApiResponse(isSettingInfoFound)
                );
            } else {
                log.error('Error while retrieving setting records from db');
                return next(isSettingInfoFound);
            }
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

export default getSettingInfo;
