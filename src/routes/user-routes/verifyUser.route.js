'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: verify-user';
const msg = 'Verify User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const verifyUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const verificationCode = req.body.verificationCode;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validateUserVerificationPayload(verificationCode);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserExist = await userManagementController.checkUserById(userId);

            if (isUserExist.isValid) {
                log.info('Call controller function to verify user');
                const isUserValidated = await userManagementController.verifyUser({userId, verificationCode});
                
                if (isUserValidated.isValid) {
                    registerLog.createInfoLog('New user registered successfully', isUserValidated);
                    
                    const mailPayload = userManagementController.sendVerificationSuccessfulMailPayload(isUserValidated.data);

                    log.info('Call email service for sending verification mail');
                    const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                    log.info('Email API execution completed');
                    
                    res.status(responseCodes[isUserValidated.resType]).json(
                        buildApiResponse(isUserValidated)
                    );
                } else {
                    return next(isUserValidated);
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

export default verifyUser;
