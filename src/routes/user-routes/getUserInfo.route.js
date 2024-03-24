'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import setting from '../../controllers/index.js';

const header = 'route: get-user-info';
const msg = 'Get User Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementSetting = setting.userManagementSetting;

// API Function
const getUserInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;

        log.info('Call controller function to get user records');
        const getUserInfo = await userManagementSetting.checkUserById(userId);

        if (getUserInfo.isValid) {
            res.status(responseCodes[getUserInfo.resType]).json(
                buildApiResponse(getUserInfo)
            );
        } else {
            log.error('Error while checking for existing record');
            return next(getUserInfo);
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

export default getUserInfo;
