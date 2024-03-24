'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import setting from '../../controllers/index.js';
import { EMAIL_SVC_URL } from '../../constants.js';
import axios from 'axios';

const header = 'route: create-user';
const msg = 'Create User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementSetting = setting.userManagementSetting;

// API Function
const createUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementSetting.validateRegisterUserPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check user already exists');
            const isUserExists = await userManagementSetting.checkUserByUserNameOrEmail(payload);

            if (isUserExists.isValid) {
                log.info('Call controller function to register new user started');
                const isUserCreated = await userManagementSetting.createNewUser(payload);

                if (isUserCreated.isValid) {
                    registerLog.createInfoLog('New user registered successfully', isUserCreated);

                    const mailPayload = userManagementSetting.sendVerificationMailPayload(isUserCreated.data);

                    log.info('Call email service for sending verification mail');
                    const mailResponse = await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
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
