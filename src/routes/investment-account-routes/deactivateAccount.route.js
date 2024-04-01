'use strict';

import { buildApiResponse, responseCodes, logger, createNewLog } from 'lib-common-service';
import controller from '../../controllers/index.js';
import { sendMail } from '../../utils/index.js';

const header = 'route: deactivate-account';
const msg = 'Deactivate Account Router started';

const log = logger(header);
const registerLog = createNewLog(header);
const accountController = controller.accountController;

// API Function
const deactivateAccount = async(req, res, next) => {
    log.info(msg);
    registerLog.createInfoLog(msg);

    try {
        const userId = req.params.userId;
        const accountToken = req.params.accountToken;
        const accountDetails = req.accountDetails;

        if (accountDetails.isActive) {
            log.info('Call controller function to set the account as inactive');
            const isAccountDeactivated = await accountController.deactivateAccount(userId, accountToken);
    
            if (isAccountDeactivated.isValid) {
                registerLog.createInfoLog('Account deactivated successfully', null, isAccountDeactivated);
                
                const mailPayload = accountController.sendAccountDeactivationMailPayload(isAccountDeactivated.data);

                log.info('Call email service for sending account deactivation mail');
                const mailResponse = await sendMail(mailPayload);
                log.info('Email API execution completed');

                res.status(responseCodes[isAccountDeactivated.resType]).json(
                    buildApiResponse(isAccountDeactivated)
                );
            } else {
                log.error('Error occurred while setting account as inactive');
                return next(isAccountDeactivated);
            }
        } else {
            log.error('Account already inactive');
            return next({
                resType: 'BAD_REQUEST',
                resMsg: 'Already Deactive Account',
                isValid: false
            });
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

export default deactivateAccount;
