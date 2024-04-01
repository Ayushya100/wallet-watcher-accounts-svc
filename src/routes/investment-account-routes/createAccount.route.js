'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: create-account';
const msg = 'Create Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const userManagementController = controller.userManagementController;
const accountController = controller.accountController;

// API Function
const createAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg, ['accountName', 'accountNumber', 'accountDate', 'holderName']);

    try {
        const userId = req.params.userId;
        const payload = req.body;

        log.info('Call payload validator');
        const isValidPayload = accountController.validateNewAccountPayload(payload);

        if (isValidPayload.isValid) {
            log.info('Call controller function to check if user records available');
            const isUserExist = await userManagementController.checkUserById(userId);

            if (isUserExist.isValid) {
                log.info('Call controller function to check if account already exist for the user');
                const isAccountAvailable = await accountController.checkAccountByAccNumber(payload.accountNumber);

                if (isAccountAvailable.isValid) {
                    log.info('Call controller function to create new account for user');
                    const isAccountCreated = await accountController.createAccount(userId, payload);

                    if (isAccountCreated.isValid) {
                        registerLog.createInfoLog('New account registered successfully', null, isAccountCreated);
                        
                        const mailPayload = accountController.sendAccountCreationMailPayload(isUserExist.data, isAccountCreated.mailPayload);

                        log.info('Call email service for sending account registration mail');
                        const mailResponse = await sendMail(mailPayload);
                        log.info('Email API execution completed');
                        
                        res.status(responseCodes[isAccountCreated.resType]).json(
                            buildApiResponse(isAccountCreated)
                        );
                    } else {
                        log.error('Error while creating a new account');
                        return next(isAccountCreated);
                    }
                } else {
                    log.error('Error while checking for account existense');
                    return next(isAccountAvailable);
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

export default createAccount;
