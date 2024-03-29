'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: request-password-reset';
const msg = 'Request Password Reset Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const requestPasswordReset = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validateResetRequestPayload(payload.userNameOrEmail);

        if(isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserAvailable = await userManagementController.checkUserByEmailOrUserName(payload.userNameOrEmail);

            if (isUserAvailable.isValid) {
                log.info('Call controller function to generate password token to send to user');
                const isRequestComplete = await userManagementController.requestReset(isUserAvailable.data);

                if (isRequestComplete.isValid) {
                    registerLog.createInfoLog('Password token generated successfully', null, isRequestComplete);

                    const mailPayload = userManagementController.sendPasswordLinkMailPayload(isRequestComplete.data);

                    log.info('Call email service for sending password reset mail');
                    const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                    log.info('Email API execution completed');

                    res.status(responseCodes[isRequestComplete.resType]).json(
                        buildApiResponse(isRequestComplete)
                    );
                } else {
                    log.error('Error while generating token to reset password for the user');
                    return next(isRequestComplete);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isUserAvailable);
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

export default requestPasswordReset;
