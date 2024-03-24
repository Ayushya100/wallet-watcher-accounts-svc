'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import setting from '../../controllers/index.js';
import { EMAIL_SVC_URL, COOKIE_OPTIONS } from '../../constants.js';
import axios from 'axios';

const header = 'route: login-user';
const msg = 'Login User Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementSetting = setting.userManagementSetting;

// API Function
const loginUser = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = userManagementSetting.validateUserLoginPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user is an authorized user');
            const isUserValid = await userManagementSetting.isUserValid(payload);

            if (isUserValid.isValid) {
                log.info('Call controller function to check if user is verified');
                const isUserVerified = await userManagementSetting.isUserVerified(isUserValid.data);

                if (isUserVerified.isValid) {
                    log.info('Call controller function to reactivate inactive user');
                    const userReactivated = await userManagementSetting.isUserActive(isUserValid.data);

                    if (userReactivated) {
                        const mailPayload = userManagementSetting.sendAccountReactivationMailPayload(isUserValid.data);
                    
                        log.info('Call email service for sending account reactivation mail');
                        await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                        log.info('Email API execution completed');
                    }

                    log.info('Call controller function to login the user and setup the tokens');
                    const loggedInUser = await userManagementSetting.generateAccessAndRefreshTokens(isUserValid.data._id);
                    
                    res.status(responseCodes[loggedInUser.resType])
                    .cookie('accessToken', loggedInUser.data.accessToken, COOKIE_OPTIONS)
                    .cookie('refreshToken', loggedInUser.data.refreshToken, COOKIE_OPTIONS)
                    .json(
                        buildApiResponse(loggedInUser)
                    );
                } else {
                    log.error('Error while check for verified user');
                    const mailPayload = userManagementSetting.sendVerificationMailPayload(isUserVerified.data);

                    log.info('Call email service for sending verification mail');
                    await axios.post(`${EMAIL_SVC_URL}/api/v1.0/emails/send-mail`, mailPayload);
                    log.info('Email API execution completed');

                    return next(isUserVerified);
                }
            } else {
                log.error('Error while checking for authorized user');
                return next(isUserValid);
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

export default loginUser;
