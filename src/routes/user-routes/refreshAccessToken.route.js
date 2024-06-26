'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { COOKIE_OPTIONS } from '../../constants.js';

const header = 'route: refresh-token';
const msg = 'Refresh User Token Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const refreshAccessToken = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        log.info('Call controller function to check the validity of token');
        const isTokenActive = userManagementController.isTokenAvailableAndActive(refreshToken);
       
        if (isTokenActive.isValid) {
            log.info('Call controller function to refresh the user token');
            const refreshedTokens = await userManagementController.refreshTokens(isTokenActive.data._id);

            if (refreshedTokens.isValid) {
                registerLog.createInfoLog('User token refreshed successfully', null, refreshedTokens);
                res.status(responseCodes[refreshedTokens.resType])
                .cookie('accessToken', refreshedTokens.data.accessToken, COOKIE_OPTIONS)
                .cookie('refreshToken', refreshedTokens.data.refreshToken, COOKIE_OPTIONS)
                .json(
                    buildApiResponse(refreshedTokens)
                );
            } else {
                log.error('Error while refreshing the user token');
                return next(refreshedTokens);
            }
        } else {
            log.error('Error while checking the validity of token');
            return next(isTokenActive);
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

export default refreshAccessToken;
