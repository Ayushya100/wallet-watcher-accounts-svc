'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: delete-card';
const msg = 'Delete Card Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const cardController = controller.cardController;

// API Function
const deleteCard = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const cardToken = req.params.cardToken;

        log.info('Call Card Controller to Delete a Card');
        const isCardDeleted = await cardController.deleteCard(userId, cardToken);

        if (isCardDeleted.isValid) {
            registerLog.createInfoLog('Card deleted successfully', null, isCardDeleted);

            const mailPayload = cardController.sendCardDeletionMailPayload(isCardDeleted.data);

            log.info('Call email service for sending card deletion mail');
            const mailResponse = await sendMail(mailPayload);
            log.info('Email API execution completed');
            
            res.status(responseCodes[isCardDeleted.resType]).json(
                buildApiResponse(isCardDeleted)
            );
        } else {
            log.error('Error occurred while deleting the card');
            return next(isCardDeleted);
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

export default deleteCard;
