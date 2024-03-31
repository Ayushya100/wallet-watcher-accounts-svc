'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: get-account-info';
const msg = 'Get Account Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const accountController = controller.accountController;

// API Function
const getAccountInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;

        if (accountToken) {
            log.info('Call controller function to get the account info by token');
            const getOneAccountInfo = await accountController.getAccountInfoByToken(userId, accountToken);

            if (getOneAccountInfo.isValid) {
                registerLog.createInfoLog('Account info by token retrieved successfully', null, getOneAccountInfo);

                res.status(responseCodes[getOneAccountInfo.resType]).json(
                    buildApiResponse(getOneAccountInfo)
                );
            } else {
                log.error('Error while retrieving account info by token');
                return next(getOneAccountInfo);
            }
        } else {
            log.info('Call controller function to get the account info by user id');
            const getAllAccountInfo = await accountController.getAllAccountInfo(userId);

            if (getAllAccountInfo) {
                registerLog.createInfoLog('All Account info retrieved successfully', null, getAllAccountInfo);

                res.status(responseCodes[getAllAccountInfo.resType]).json(
                    buildApiResponse(getAllAccountInfo)
                );
            } else {
                log.error('Error while retrieving account info');
                return next(getAllAccountInfo);
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

export default getAccountInfo;
