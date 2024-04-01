'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: register-card';
const msg = 'Register Card Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;
const cardController = controller.cardController;

// API Function
const registerCard = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['cardNumber', 'cardType', 'bankInfo', 'expirationDate', 'holderName', 'balance']);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = cardController.validateRegisterCardPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user records available');
            const isUserExist = await userManagementController.checkUserById(userId);

            if (isUserExist.isValid) {
                log.info('Call controller function to check if card by number exists');
                const isCardExist = await cardController.checkCardByCardNumber(payload.cardNumber);
                
                if (isCardExist.isValid) {
                    log.info('Call controller function to store new card info in database')
                    const isCardRegistered = await cardController.registerNewCard(userId, payload);

                    if (isCardRegistered.isValid) {
                        registerLog.createInfoLog('New card registered successfully', null, isCardRegistered);
                        
                        const mailPayload = cardController.sendCardCreationMailPayload(isUserExist.data, isCardRegistered.mailPayload);

                        log.info('Call email service for sending card registration mail');
                        const mailResponse = await sendMail(mailPayload);
                        log.info('Email API execution completed');
                        
                        res.status(responseCodes[isCardRegistered.resType]).json(
                            buildApiResponse(isCardRegistered)
                        );
                    } else {
                        log.error('Error while storing new card info in database');
                        return next(isCardRegistered);
                    }
                } else {
                    log.error('Error while check for card with provided card number');
                    return next(isCardExist);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isUserExist);
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

export default registerCard;
