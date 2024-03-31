'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: reactivate-card';
const msg = 'Reactivate Card Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const cardController = controller.cardController;

// API Function
const reactivateCard = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;
        const cardDetails = req.cardDetails;

        if (!cardDetails.isActive) {
            log.info('Call controller function to validate and activate the card');
            const isCardValidToReactivate = cardController.isCardValidToReactivate(cardDetails);
    
            if (isCardValidToReactivate.isValid) {
                log.info('Call controller function to reactivate the card');
                const isCardReactivated = await cardController.reactivateCard(userId, cardToken);
    
                if (isCardReactivated.isValid) {
                    registerLog.createInfoLog('Card reactivated successfully', null, isCardReactivated);
                
                    const mailPayload = cardController.sendCardReactivationMailPayload(isCardReactivated.data);

                    log.info('Call email service for sending card reactivation mail');
                    const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                    log.info('Email API execution completed');
                
                    res.status(responseCodes[isCardReactivated.resType]).json(
                        buildApiResponse(isCardReactivated)
                    );
                } else {
                    log.error('Error while reactivating the card');
                    return next(isCardReactivated);
                }     
            } else {
                log.error('Error while validating the card');
                return next(isCardValidToReactivate);
            }
        } else {
            log.error('Card already active');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: 'Already Active Card',
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

export default reactivateCard;
