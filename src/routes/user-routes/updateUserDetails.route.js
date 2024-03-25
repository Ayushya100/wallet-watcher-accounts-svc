'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: update-user-details';
const msg = 'Update User details Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const updateUserDetails = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call payload validator')
        const isValidPayload = userManagementController.validateUserDetailsPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserAvailable = await userManagementController.checkUserById(userId);

            if (isUserAvailable.isValid) {
                log.info('Call controller function to update the user details');
                const isUserInfoUpdated = await userManagementController.updateUserDetails(userId, payload);

                if (isUserInfoUpdated.isValid) {
                    registerLog.createInfoLog('User details updated successfully', isUserInfoUpdated);

                    const mailPayload = userManagementController.sendUpdateDetailsMailPayload(isUserInfoUpdated.data);

                    log.info('Call email service for sending verification mail');
                    const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                    log.info('Email API execution completed');

                    res.status(responseCodes[isUserInfoUpdated.resType]).json(
                        buildApiResponse(isUserInfoUpdated)
                    );
                } else {
                    log.error('Error while updating user details');
                    return next(isUserInfoUpdated);
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

export default updateUserDetails;
