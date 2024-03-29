'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: deactivate-user';
const msg = 'Deactivate User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const deactivateUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['password']);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validateDeactivateUserPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserAvailable = await userManagementController.checkUserById(userId);

            if (isUserAvailable.isValid) {
                log.info('Call controller function to validate the user credentials');
                const isValidCredentials = await userManagementController.validateUserCredentials(userId, payload);
                
                if (isValidCredentials.isValid) {
                    log.info('Call controller function to deactivate user');
                    const isUserDeactivated = await userManagementController.deactivateUser(userId);

                    if (isUserDeactivated.isValid) {
                        registerLog.createInfoLog('User deactivated successfully', null, isUserDeactivated);

                        const mailPayload = userManagementController.sendAccountDeactivateMailPayload(isUserDeactivated.data);

                        log.info('Call email service for sending password update mail');
                        const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                        log.info('Email API execution completed');

                        res.status(responseCodes[isUserDeactivated.resType]).json(
                            buildApiResponse(isUserDeactivated)
                        );
                    } else {
                        log.error('Error while deactivating user');
                        return next(isUserDeactivated);
                    }
                } else {
                    log.error('Error while validating the user credentials');
                    return next(isValidCredentials);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isUserAvailable);
            }
        } else {
            log.error('Error while validating the payload');
            return next(isValidPayload);
        }
    } catch(err) {
        log.error('Internal Error occurred while working with router functions');
        next({
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: err,
            stack: err.stack,
            isValid: false
        });
    }
}

export default deactivateUser;
