'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

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
                registerLog.createInfoLog('New card registered successfully', null, isCardDeactivated);
                
                const mailPayload = cardController.sendCardDeactivationMailPayload(isCardDeactivated.data);

                log.info('Call email service for sending card registration mail');
                const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                log.info('Email API execution completed');
                
                res.status(responseCodes[isCardDeactivated.resType]).json(
                    buildApiResponse(isCardDeactivated)
                );
            } else {
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
