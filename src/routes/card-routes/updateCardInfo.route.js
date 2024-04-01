'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: update-card-info-setting';
const msg = 'Update Card Info Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const cardController = controller.cardController;

// API Function
const updateCardInfo = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = cardController.validateUpdateCardPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to update card information');
            const isCardDetailsUpdated = await cardController.updateCardInfo(userId, cardToken, payload);

            if (isCardDetailsUpdated.isValid) {
                registerLog.createInfoLog('Card details updated successfully', null, isCardDetailsUpdated);
                        
                const mailPayload = cardController.sendCardUpdationMailPayload(isCardDetailsUpdated.data);

                log.info('Call email service for sending card updating mail');
                const mailResponse = await sendMail(mailPayload);
                log.info('Email API execution completed');
                
                res.status(responseCodes[isCardDetailsUpdated.resType]).json(
                    buildApiResponse(isCardDetailsUpdated)
                );
            } else {
                log.error('Error while updating card information');
                return next(isCardDetailsUpdated);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
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

export default updateCardInfo;
