'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: update-user-password';
const msg = 'Update User Password Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const updateUserPassword = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['oldPassword', 'newPassword']);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validatePasswordUpdatePayload(payload);

        if(isValidPayload.isValid) {
            log.info('Call controller function to check if user exists');
            const isUserAvailable = await userManagementController.checkUserById(userId);

            if (isUserAvailable.isValid) {
                log.info('Call controller function to update password');
                const isPasswordUpdated = await userManagementController.updateUserPassword(userId, payload);
                
                if (isPasswordUpdated.isValid) {
                    registerLog.createInfoLog('User password updated successfully', null, isPasswordUpdated);

                    const mailPayload = userManagementController.sendUpdatePasswordMailPayload(isPasswordUpdated.data);

                    log.info('Call email service for sending password update mail');
                    const mailResponse = await sendMail(mailPayload);
                    log.info('Email API execution completed');

                    res.status(responseCodes[isPasswordUpdated.resType]).json(
                        buildApiResponse(isPasswordUpdated)
                    );
                } else {
                    log.error('Error while updating the password for the user');
                    return next(isPasswordUpdated);
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

export default updateUserPassword;
