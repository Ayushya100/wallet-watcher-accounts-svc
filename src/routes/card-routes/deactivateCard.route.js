'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: deactivate-card';
const msg = 'Deactivate Card Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const cardController = controller.cardController;

// API Function
const deactivateCard = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;
        const cardDetails = req.cardDetails;

        if (cardDetails.isActive) {
            log.info('Call controller function to set the card as inactive');
            const isCardDeactivated = await cardController.deactivateCard(userId, cardToken);
    
            if (isCardDeactivated.isValid) {
                registerLog.createInfoLog('Card deactivated successfully', null, isCardDeactivated);
                
                const mailPayload = cardController.sendCardDeactivationMailPayload(isCardDeactivated.data);

                log.info('Call email service for sending card deactivation mail');
                const mailResponse = await sendMail(mailPayload);
                log.info('Email API execution completed');
                
                res.status(responseCodes[isCardDeactivated.resType]).json(
                    buildApiResponse(isCardDeactivated)
                );
            } else {
                log.error('Error occurred while setting card as inactive');
                return next(isCardDeactivated);
            }
        } else {
            log.error('Card already inactive');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: 'Already Deactive Card',
                isValid: false
            });
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

export default deactivateCard;
