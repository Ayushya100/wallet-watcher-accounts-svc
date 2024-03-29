'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const header = 'route: logout-user';
const msg = 'Logout User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const logoutUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.user.userId;

        log.info('Call controller function to check if user exists');
        const isUserAvailable = await userManagementController.checkUserById(userId);

        if (isUserAvailable.isValid) {
            log.info('Call controller function to logout user');
            const isUserLoggedout = await userManagementController.logoutUser(userId);

            if (isUserLoggedout.isValid) {
                registerLog.createInfoLog('User Logged-out successfully', null, isUserLoggedout);
                res.status(responseCodes[isUserLoggedout.resType])
                .clearCookie('accessToken', COOKIE_OPTIONS)
                .clearCookie('refreshToken', COOKIE_OPTIONS)
                .json(
                    buildApiResponse(isUserLoggedout)
                );
            } else {
                log.error('Error while logging-out user');
                return next(isUserLoggedout);
            }
        } else {
            log.error('Error while checking for existing record');
            return next(isUserAvailable);
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

export default logoutUser;
