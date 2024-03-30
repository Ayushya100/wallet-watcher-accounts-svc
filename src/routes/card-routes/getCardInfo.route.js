'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';

const header = 'route: get-card-details-setting';
const msg = 'Get Card Details Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const cardController = controller.cardController;

// API Function
const getCardInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;

        if (cardToken) {
            log.info('Call controller function to get the specific card info');
            const getOneCardInfo = await cardController.getCardInfoByToken(userId, cardToken);

            if (getOneCardInfo.isValid) {
                registerLog.createInfoLog('Successfully returned specific card information', null, getOneCardInfo);
                res.status(responseCodes[getOneCardInfo.resType]).json(
                    buildApiResponse(getOneCardInfo)
                );
            } else {
                log.error('Error while retrieving card information');
                return next(getOneCardInfo);
            }
        } else {
            log.info('Call controller function to get all the card info');
            const getAllCardInfo = await cardController.getAllCardsInfo(userId);

            if (getAllCardInfo.isValid) {
                registerLog.createInfoLog('Successfully returned all card information', null, getAllCardInfo);
                res.status(responseCodes[getAllCardInfo.resType]).json(
                    buildApiResponse(getAllCardInfo)
                );
            } else {
                log.error('Error while retrieving card information');
                return next(getAllCardInfo);
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

export default getCardInfo;
