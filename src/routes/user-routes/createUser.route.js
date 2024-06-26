'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: create-user';
const msg = 'Create User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;

// API Function
const createUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['password']);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementController.validateRegisterUserPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check user already exists');
            const isUserExists = await userManagementController.checkUserByUserNameOrEmail(payload);

            if (isUserExists.isValid) {
                log.info('Call controller function to register new user started');
                const isUserCreated = await userManagementController.createNewUser(payload);

                if (isUserCreated.isValid) {
                    registerLog.createInfoLog('New user registered successfully', null, isUserCreated);

                    const mailPayload = userManagementController.sendVerificationMailPayload(isUserCreated.data);

                    log.info('Call email service for sending verification mail');
                    const mailResponse = await sendMail(mailPayload);
                    log.info('Email API execution completed');

                    res.status(responseCodes[isUserCreated.resType]).json(
                        buildApiResponse(isUserCreated)
                    );
                } else {
                    log.error('Error while creating new user record in db');
                    return next(isUserCreated);
                }
            } else {
                log.error('Error while checking for existing record');
                return next(isUserExists);
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

export default createUser;
